import { UserTitleUsecase } from "@/application/usecases/title/UserTitleUsecase";
import { ITitleRepository, IUserTitleRepository } from "@/domain/repositories";
import { PriCharacterRepository, PriTitleRepository, PriUserTitleRepository } from "@/infrastructure/repositories";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

    const userIdHeader = req.headers.get("user-id");
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    
    const characterRepository = new PriCharacterRepository(prisma);
    const character = await characterRepository.findByUserId(Number(userIdHeader));
    const characterId = Number(character?.id)

    // 리포지토리 인스턴스 생성
    const userTitleRepository: IUserTitleRepository = new PriUserTitleRepository(prisma);
    const titleRepository: ITitleRepository = new PriTitleRepository(prisma);

    // UserTitleUsecase 인스턴스 생성
    const userTitleUsecase = new UserTitleUsecase(
        userTitleRepository,
        titleRepository
    );

    try {
        // 사용자의 타이틀 목록 가져오기
        const userTitles = await userTitleUsecase.getUserTitles(characterId, page);
        return NextResponse.json(userTitles);
    } catch (error) {
        console.error("Error fetching user titles:", error);
        return NextResponse.json({ error: "Failed to fetch user titles" }, { status: 500 });
    }
}