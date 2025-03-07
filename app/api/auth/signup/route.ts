import { SignUpRequestDTO } from "@/application/usecases/auth/dtos/SignUpRequestDTO";
import { SignUpUsecase } from "@/application/usecases/auth/SignUpUsecase";
import { ICharacterRepository, IStatusRepository, IUserRepository } from "@/domain/repositories";
import { PriCharacterRepository, PriStatusRepository, PriUserRepository } from "@/infrastructure/repositories";
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
    
    // 유스케이스 생성
    const signUpUsecase = new SignUpUsecase(userRepository, characterRepository, statusRepository);

    // 유스케이스 실행
    await signUpUsecase.execute(userData);
    
    try {
        return NextResponse.json({ message:"회원가입 성공" }, { status: 201 });
    } catch (error) {
        console.error("❌ 회원가입 오류", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}