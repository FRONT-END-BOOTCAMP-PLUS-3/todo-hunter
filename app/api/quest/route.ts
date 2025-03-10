import { NextResponse } from 'next/server';
import { CreateQuestUseCase } from '@/application/usecases/quest/CreateQuestUsecase';
import { PriQuestRepository, PriStatusRepository } from '@/infrastructure/repositories';
import { prisma } from '@/lib/prisma';
import { CreateQuestDTO } from '@/application/usecases/quest/dtos';

// POST 요청 (새 퀘스트 생성)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { characterId, name, tagged, isWeekly, expiredAt } = body;

    // Repository 인스턴스 생성
    const questRepository = new PriQuestRepository(prisma);
    const statusRepository = new PriStatusRepository(prisma);
    const createQuestUseCase = new CreateQuestUseCase(questRepository, statusRepository);

    if (!characterId || !name || !tagged) {
      return NextResponse.json({ success: false, error: "필수 값이 누락되었습니다." }, { status: 400 });
    }

    // DTO 생성 (null 대신 undefined 사용)
    const dto: CreateQuestDTO = {
      characterId,
      name,
      tagged,
      isWeekly,
      expiredAt: expiredAt ? new Date(expiredAt) : undefined,
    };

    // UseCase 실행, 퀘스트 생성
    const newQuest = await createQuestUseCase.createQuest(dto);

    return NextResponse.json({ success: true, quest: newQuest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "알 수 없는 오류 발생" }, { status: 500 });
  }
}

// GET 요청 (모든 퀘스트 조회 또는 특정 ID 기반 조회)
export async function GET(req: Request) {
  try {
    const quests = await prisma.quest.findMany({
      include: { successDays: true },
      orderBy: { updatedAt: "desc" },
    });

    // API에서 completed 필드 추가하여 반환
    const formattedQuests = quests.map((quest) => ({
      ...quest,
      completed: quest.successDays.length > 0, // DB에서 직접 계산하여 반환
    }));

    return NextResponse.json({ success: true, quests: formattedQuests }, { status: 200 });
  } catch (error) {
    console.error("퀘스트 조회 중 오류 발생:", error);
    return NextResponse.json({ success: false, error: "퀘스트 조회 중 오류 발생" }, { status: 500 });
  }
}


