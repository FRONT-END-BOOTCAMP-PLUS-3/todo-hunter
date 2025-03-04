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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // 특정 퀘스트 조회
      const quest = await prisma.quest.findUnique({
        where: { id: Number(id) },
      });

      if (!quest) {
        return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
      }

      return NextResponse.json(quest, { status: 200 });
    }

    // 모든 퀘스트 조회
    const quests = await prisma.quest.findMany();
    return NextResponse.json(quests, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
