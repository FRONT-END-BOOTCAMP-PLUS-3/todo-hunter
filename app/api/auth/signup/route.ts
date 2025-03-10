import { SignUpRequestDTO } from "@/application/usecases/auth/dtos/SignUpRequestDTO";
import { SignUpUsecase } from "@/application/usecases/auth/SignUpUsecase";
import { ICharacterRepository, IStatusRepository, IUserRepository } from "@/domain/repositories";
import { IRdAuthenticationRepository } from "@/domain/repositories/IRdAuthenticationRepository";
import { PriCharacterRepository, PriStatusRepository, PriUserRepository } from "@/infrastructure/repositories";
import { RdAuthenticationRepository } from "@/infrastructure/repositories/RdAuthenticationRepository";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userData: SignUpRequestDTO = await req.json();

    // 필수 필드 체크
    if (!userData.loginId || !userData.email || !userData.nickname || !userData.password) {
        return NextResponse.json({ error: "모든 필드를 입력해야 합니다." }, { status: 400 });
    }

    // 리포지토리 생성
    const userRepository:IUserRepository = new PriUserRepository(prisma);
    const characterRepository:ICharacterRepository = new PriCharacterRepository(prisma);
    const statusRepository:IStatusRepository = new PriStatusRepository(prisma);
    const rdAuthenticationRepository: IRdAuthenticationRepository = new RdAuthenticationRepository();
    
    // 유스케이스 생성
    const signUpUsecase = new SignUpUsecase(userRepository, characterRepository, statusRepository, rdAuthenticationRepository);

    // // 유스케이스 실행 (가입만 실행 시)
    // await signUpUsecase.execute(userData);
    
    // try {
    //     return NextResponse.json({ message:"회원가입 성공" }, { status: 201 });
    // } catch (error) {
    //     console.error("❌ 회원가입 오류", error);
    //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    // }

    // 유스케이스 실행 (가입 후 토큰 생성 후 로그인)
    const { accessToken, refreshToken } = await signUpUsecase.execute(userData);

    try {
        // 쿠키 설정 및 응답
        const response = NextResponse.json({ message: "회원가입 성공" }, { status: 201 });
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true, // XSS 방지
            secure: process.env.NODE_ENV === "production", // 프로덕션에서만 Secure 적용
            path: "/", // 모든 경로에서 사용 가능
            // maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES || "3600", 10), // 유효기간 (초 단위)
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES || "3600", 10), // 유효기간 (초 단위)
        });

        return response;
    } catch (error) {
        console.error("❌ 회원가입 오류", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}