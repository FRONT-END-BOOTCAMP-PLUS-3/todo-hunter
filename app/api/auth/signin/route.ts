import { IUserRepository } from "@/domain/repositories";
import { PriUserRepository } from "@/infrastructure/repositories";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignInUsecase } from "@/application/usecases/auth/SignInUsecase";
import { VerifyPasswordUsecase } from "@/application/usecases/auth/VerifyPasswordUsecase";
import { SignInResponseDTO } from "@/application/usecases/auth/dtos/SignInResponseDTO";
import { SignInRequestDTO } from "@/application/usecases/auth/dtos/SignInRequestDTO";
import { LoginError, LoginErrorType } from "@/application/usecases/auth/errors/LoginError";
import { RdAuthenticationRepository } from "@/infrastructure/repositories/RdAuthenticationRepository";
import { GenerateAccessTokenUsecase } from "@/application/usecases/auth/GenerateAccessTokenUsecase";
import { GenerateRefreshTokenUsecase } from "@/application/usecases/auth/GenerateRefreshTokenUsecase";
import { VerifyRefreshTokenUsecase } from "@/application/usecases/auth/VerifyRefreshTokenUsecase";
import { RenewRefreshTokenUsecase } from "@/application/usecases/auth/RenewRefreshTokenUsecase";

export async function POST(req: NextRequest) {
    try {
        const request: SignInRequestDTO = await req.json();
        const userRepository: IUserRepository = new PriUserRepository(prisma);
        const verifyPasswordUsecase = new VerifyPasswordUsecase();
        const signInUsecase = new SignInUsecase(userRepository, verifyPasswordUsecase);
        const signInResponseDto: SignInResponseDTO = await signInUsecase.execute(request);
        
        const authenticationRepository = new RdAuthenticationRepository();
        const generateAccessTokenUsecase = new GenerateAccessTokenUsecase();
        const generateRefreshTokenUsecase = new GenerateRefreshTokenUsecase(authenticationRepository);
        const renewRefreshTokenUsecase = new RenewRefreshTokenUsecase(authenticationRepository);
        const verifyRefreshTokenUsecase = new VerifyRefreshTokenUsecase();
        
        // 사용자 ID 생성
        const loginId = signInResponseDto.loginId;

        // 기존 Refresh Token 확인
        const existingRefreshToken = await authenticationRepository.getRefreshToken(loginId);
        let refreshToken: string;

        if (existingRefreshToken) {
            // 기존 Refresh Token이 유효한지 검증
            const decoded = await verifyRefreshTokenUsecase.execute(existingRefreshToken);
            if (decoded) {
                // 유효하면 재사용
                refreshToken = existingRefreshToken;
            } else {
                // 유효하지 않으면 새로 발급
                refreshToken = await renewRefreshTokenUsecase.execute({ loginId: loginId });
            }
        } else {
            // Refresh Token이 없으면 새로 발급
            refreshToken = await generateRefreshTokenUsecase.execute({ loginId: loginId });
        }

        // Access Token 생성
        const accessToken = await generateAccessTokenUsecase.execute({ loginId: loginId });

        // 쿠키 설정 및 응답
        const response = NextResponse.json({ accessToken }, { status: 200 });
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true, // XSS 방지
            secure: process.env.NODE_ENV === "production", // 프로덕션에서만 Secure 적용
            path: "/", // 모든 경로에서 사용 가능
            maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES || "3600", 10), // 유효기간 (초 단위)
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES || "3600", 10), // 유효기간 (초 단위)
        });

        return response;
    } catch (error) {
        console.error("❌ 로그인 오류", error);

        if(error instanceof LoginError){
            const errorMapping: Record<LoginErrorType, {message: string; status: number}> = {
                MISSING_CREDENTIALS: {
                message: "이메일과 비밀번호를 모두 입력해주세요.",
                status: 400,
                },
                LOGIN_ID_NOT_FOUND: {
                message: "가입되지 않은 아이디입니다. 회원가입 후 이용해주세요.",
                status: 401,
                },
                INVALID_PASSWORD: {
                message: "비밀번호가 올바르지 않습니다. 다시 시도해주세요.",
                status: 401,
                },
                UNKNOWN_ERROR: {
                message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                status: 500,
                },
            };

            const response = errorMapping[error.type] || errorMapping["UNKNOWN_ERROR"];
            return NextResponse.json({error: response.message}, {status: response.status});
        }

        return NextResponse.json(
            {error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}, {status: 500}
        );
    }
}