import { NextResponse } from "next/server";
import { DeleteQuestUseCase } from "@/application/usecases/quest/DeleteQuestUsecase";
import { PriQuestRepository } from "@/infrastructure/repositories";
import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/utils/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const questId = Number(params.id);
    if (isNaN(questId)) {
      return NextResponse.json({ error: "유효하지 않은 퀘스트 ID입니다." }, { status: 400 });
    }

    // 쿠키에서 유저 정보 가져오기
    const user = await getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    const questRepository = new PriQuestRepository(prisma);
    const deleteQuestUseCase = new DeleteQuestUseCase(questRepository);

    // DTO 생성 (characterId는 쿠키에서 가져옴)
    const dto = {
      id: questId,
      characterId: user.characterId, // 쿠키에서 추출한 ID 사용
    };

    await deleteQuestUseCase.deleteQuest(dto);

    return NextResponse.json({ message: "퀘스트가 삭제되었습니다." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "알 수 없는 오류 발생" },
      { status: 500 }
    );
  }
}
