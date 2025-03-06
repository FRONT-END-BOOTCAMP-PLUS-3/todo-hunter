import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questId } = body; // body에서 questId를 가져옴

    if (!questId) {
      return NextResponse.json({ success: false, error: "퀘스트 ID가 필요합니다." }, { status: 400 });
    }

    // 완료된 기록이 있는지 확인
    const existingSuccess = await prisma.successDay.findFirst({
      where: { questId },
    });

    if (!existingSuccess) {
      await prisma.successDay.create({ data: { questId } });
    }

    return NextResponse.json({ success: true, message: "퀘스트 완료!" }, { status: 200 });
  } catch (error) {
    console.error("퀘스트 완료 처리 중 오류 발생:", error);
    return NextResponse.json({ success: false, error: "퀘스트 완료 중 오류 발생" }, { status: 500 });
  }
}