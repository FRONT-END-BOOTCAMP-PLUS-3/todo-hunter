import { NextResponse } from "next/server";
import { DeleteQuestUseCase } from "@/application/usecases/quest/DeleteQuestUsecase";
import { PriQuestRepository, PriSuccessDayRepository } from "@/infrastructure/repositories";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const questId = Number(params.id);
    if (isNaN(questId)) {
      return NextResponse.json({ success: false, error: "유효하지 않은 퀘스트 ID입니다." }, { status: 400 });
    }

    // 클라이언트에서 쿼리 스트링으로 `characterId`를 전달
    const { searchParams } = new URL(req.url);
    const characterId = Number(searchParams.get("characterId"));

    if (!characterId) {
      return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
    }

    console.log("DELETE 요청 받음 - characterId:", characterId, "questId:", questId);

    // 퀘스트 삭제 처리
    const questRepository = new PriQuestRepository(prisma);
    const successDayRepository = new PriSuccessDayRepository(prisma);
    const deleteQuestUseCase = new DeleteQuestUseCase(questRepository, successDayRepository);

    await deleteQuestUseCase.deleteQuest({ id: questId, characterId });

    return NextResponse.json({ success: true, message: "퀘스트가 삭제되었습니다." }, { status: 200 });
  } catch (error) {
    console.error("퀘스트 삭제 중 오류 발생:", error);
    return NextResponse.json({ success: false, error: "알 수 없는 오류 발생" }, { status: 500 });
  }
}
