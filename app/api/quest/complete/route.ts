import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CompleteQuestUsecase } from "@/application/usecases/quest/CompleteQuestUsecase";
import { PriQuestRepository, PriSuccessDayRepository, PriCharacterRepository, PriStatusRepository } from "@/infrastructure/repositories";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { characterId, questId } = body;

    if (!characterId || !questId) {
      return NextResponse.json({ error: "characterId와 questId가 필요합니다." }, { status: 400 });
    }

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

    await completeQuestUsecase.completeQuest(characterId, questId);

    return NextResponse.json({ message: "퀘스트 완료!" }, { status: 200 });
  } catch (error) {
    console.error("퀘스트 완료 처리 중 오류 발생:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "알 수 없는 오류 발생" }, { status: 500 });
  }
}
