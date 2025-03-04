import { UserTitleUsecase } from "@/application/usecases/title/UserTitleUsecase";
import { ITitleRepository, IUserTitleRepository } from "@/domain/repositories";
import { PriTitleRepository, PriUserTitleRepository } from "@/infrastructure/repositories";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

    const userIdHeader = req.headers.get("user-id");
    const characterId = Number(userIdHeader);
    const page = Number(req.headers.get("page")) || 1;
    const pageSize = Number(req.headers.get("page-size")) || 10;

    if (isNaN(characterId)) {
        return NextResponse.json({ error: "Invalid character ID" }, { status: 400 });
    }

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
        const userTitles = await userTitleUsecase.getUserTitles(characterId, page, pageSize);
        return NextResponse.json(userTitles);
    } catch (error) {
        console.error("Error fetching user titles:", error);
        return NextResponse.json({ error: "Failed to fetch user titles" }, { status: 500 });
    }
}