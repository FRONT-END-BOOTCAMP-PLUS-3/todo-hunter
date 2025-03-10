import { NextResponse } from "next/server";
import { DeleteQuestUseCase } from "@/application/usecases/quest/DeleteQuestUsecase";
import { PriQuestRepository, PriSuccessDayRepository } from "@/infrastructure/repositories";
import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/utils/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const questId = Number(params.id);
    if (isNaN(questId)) {
      return NextResponse.json({ success: false, error: "유효하지 않은 퀘스트 ID입니다." }, { status: 400 });
    }

    // 인증된 사용자 확인
    const user = await getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    // 퀘스트 삭제 처리
    const questRepository = new PriQuestRepository(prisma);
    const successDayRepository = new PriSuccessDayRepository(prisma);
    const deleteQuestUseCase = new DeleteQuestUseCase(questRepository, successDayRepository);

    await deleteQuestUseCase.deleteQuest({ id: questId, characterId: user.characterId });

    return NextResponse.json({ success: true, message: "퀘스트가 삭제되었습니다." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "알 수 없는 오류 발생" }, { status: 500 });
  }
}
