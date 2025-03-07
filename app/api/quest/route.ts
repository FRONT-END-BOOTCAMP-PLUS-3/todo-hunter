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

    // DTO 생성 (null 대신 undefined 사용)
    const dto: CreateQuestDTO = {
      characterId,
      name,
      tagged,
      isWeekly,
      expiredAt: expiredAt ? new Date(expiredAt) : undefined,
    };

    // Use Case 실행
    const newQuest = await createQuestUseCase.createQuest(dto);

    return NextResponse.json(newQuest, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

// GET 요청 (모든 퀘스트 조회 또는 특정 ID 기반 조회)
export async function GET(req: Request) {
  try {
    const quests = await prisma.quest.findMany({
      include: {
        successDays: true, // 성공 기록 포함하여 가져오기
      },
      orderBy: { updatedAt: "desc" }
    });
    
    // successDays 배열을 기반으로 completed 값 추가
    const formattedQuests = quests
      .map((quest) => ({
        ...quest,
        completed: quest.successDays.length > 0, // 성공 기록이 있으면 true, 없으면 false
      }));

    return NextResponse.json(formattedQuests, { status: 200 });
  } catch (error) {
    console.error("퀘스트 조회 중 오류 발생:", error);
    return NextResponse.json({ error: "퀘스트 조회 중 오류 발생" }, { status: 500 });
  }
}


