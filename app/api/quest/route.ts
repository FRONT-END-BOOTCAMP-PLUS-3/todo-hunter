import { NextRequest, NextResponse } from 'next/server';
import { CreateQuestUseCase } from '@/application/usecases/quest/CreateQuestUsecase';
import { PriQuestRepository, PriStatusRepository } from '@/infrastructure/repositories';
import { prisma } from '@/lib/prisma';
import { CreateQuestDTO } from '@/application/usecases/quest/dtos';
import { getUserFromRequest } from '@/utils/auth';

// POST 요청 (새 퀘스트 생성)
export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/quest 실행"); // 실행 여부 확인

    // 🔹 유저 정보 가져오기
    const userId = await getUserFromRequest(req);
    if (!userId || typeof userId !== "number") {
      return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
    }

    // 🔹 요청 바디 파싱
    const body = await req.json();
    console.log("POST 요청 바디:", body); // 요청 데이터 확인

    const { name, tagged, isWeekly, expiredAt } = body;

    // 🔹 필수 값 검증
    if (!name || !tagged) {
      return NextResponse.json({ success: false, error: "필수 값이 누락되었습니다." }, { status: 400 });
    }

    // 🔹 DTO 생성 (characterId는 로그인한 유저의 ID로 설정)
    const dto: CreateQuestDTO = {
      characterId: userId, // 로그인한 유저의 ID 사용
      name,
      tagged,
      isWeekly,
      expiredAt: expiredAt ? new Date(expiredAt) : undefined,
    };

    console.log("저장할 퀘스트 데이터:", dto); // 저장할 데이터 확인

    // 🔹 퀘스트 생성
    const questRepository = new PriQuestRepository(prisma);
    const statusRepository = new PriStatusRepository(prisma);
    const createQuestUseCase = new CreateQuestUseCase(questRepository, statusRepository);
    const newQuest = await createQuestUseCase.createQuest(dto);

    return NextResponse.json({ success: true, quest: newQuest }, { status: 201 });
  } catch (error) {
    console.error("퀘스트 생성 중 오류 발생:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류 발생" },
      { status: 500 }
    );
  }
}

// GET 요청
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get("characterId"); // 로그인한 유저 ID 가져오기

    if (!characterId) {
      return NextResponse.json({ success: false, error: "characterId가 필요합니다." }, { status: 400 });
    }

    const quests = await prisma.quest.findMany({
      where: { characterId: Number(characterId) }, // 로그인한 유저의 퀘스트만 조회
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


