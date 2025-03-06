import { NextResponse } from "next/server";
import { CompleteQuestUsecase } from "@/application/usecases/quest/CompleteQuestUsecase";
import { PriQuestRepository, PriSuccessDayRepository, PriCharacterRepository, PriStatusRepository } from "@/infrastructure/repositories";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { characterId, questId } = body; // characterId 추가

    if (!characterId || !questId) {
      return NextResponse.json({ success: false, error: "characterId와 questId가 필요합니다." }, { status: 400 });
    }

    console.log(`[DEBUG] 퀘스트 완료 API 호출: characterId=${characterId}, questId=${questId}`);

    // UseCase 인스턴스 생성
    const questRepository = new PriQuestRepository(prisma);
    const successDayRepository = new PriSuccessDayRepository(prisma);
    const characterRepository = new PriCharacterRepository(prisma);
    const statusRepository = new PriStatusRepository(prisma);

    const completeQuestUsecase = new CompleteQuestUsecase(
      questRepository,
      successDayRepository,
      characterRepository,
      statusRepository
    );

    // UseCase 실행
    await completeQuestUsecase.completeQuest(characterId, questId);

    return NextResponse.json({ success: true, message: "퀘스트 완료 처리 성공!" }, { status: 200 });
  } catch (error) {
    console.error("[ERROR] 퀘스트 완료 처리 중 오류 발생:", error);
    return NextResponse.json({ success: false, error: "퀘스트 완료 중 오류 발생" }, { status: 500 });
  }
}