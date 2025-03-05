import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { characterId, questId } = body;

    if (!characterId || !questId) {
      return NextResponse.json({ error: "characterId와 questId가 필요합니다." }, { status: 400 });
    }

    // 이미 완료된 기록이 있는지 확인
    const existingSuccess = await prisma.successDay.findFirst({
      where: { questId },
    });

    if (!existingSuccess) {
      // 완료된 적이 없으면 새 성공 기록 추가
      await prisma.successDay.create({
        data: {
          questId,
        },
      });
    }

    return NextResponse.json({ message: "퀘스트 완료!" }, { status: 200 });
  } catch (error) {
    console.error("퀘스트 완료 처리 중 오류 발생:", error);
    return NextResponse.json({ error: "퀘스트 완료 중 오류 발생" }, { status: 500 });
  }
}
