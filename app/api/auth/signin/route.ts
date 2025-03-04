import { IUserRepository } from "@/domain/repositories";
import { PriUserRepository } from "@/infrastructure/repositories";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SignInUsecase } from "@/application/usecases/auth/SignInUsecase";
import { VerifyPasswordUsecase } from "@/application/usecases/auth/VerifyPasswordUsecase";
import { SignInResponseDTO } from "@/application/usecases/auth/dtos/SignInResponseDTO";
import { SignInRequestDTO } from "@/application/usecases/auth/dtos/SignInRequestDTO";
import { LoginError, LoginErrorType } from "@/application/usecases/auth/errors/LoginError";
import { IVerifyPasswordUsecase } from "@/application/usecases/auth/interfaces/IVerifyPasswordUsecase";

export async function POST(req: NextRequest) {
    try {
        const request: SignInRequestDTO = await req.json();
        const prisma = new PrismaClient();
        const userRepository: IUserRepository = new PriUserRepository(prisma);
        const verifyPasswordUsecase:IVerifyPasswordUsecase = new VerifyPasswordUsecase();
        const signInUsecase = new SignInUsecase(userRepository, verifyPasswordUsecase);
        const signInResponseDto: SignInResponseDTO = await signInUsecase.execute(request);
    
        return NextResponse.json(signInResponseDto, {status:200});
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