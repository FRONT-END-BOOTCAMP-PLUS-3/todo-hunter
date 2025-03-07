import { NextResponse } from "next/server";
import { EndingUsecase } from "@/application/usecases/ending/EndingUsecase";
import {
  PriTitleRepository,
  PriUserTitleRepository,
  PriCharacterRepository,
  PriStatusRepository,
} from "@/infrastructure/repositories";
import { prisma } from "@/lib/prisma";

// 엔딩 페이지 랜딩시 호출되는 API
export async function GET(request: Request) {
  try {
    const userId = request.headers.get("X-User-Id"); // 수신 request headers

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const titleRepository = new PriTitleRepository(prisma);
    const userTitleRepository = new PriUserTitleRepository(prisma);
    const characterRepository = new PriCharacterRepository(prisma);
    const statusRepository = new PriStatusRepository(prisma);

    const endingUsecase = new EndingUsecase(
      titleRepository,
      userTitleRepository,
      characterRepository,
      statusRepository
    );

    const result = await endingUsecase.execute(Number(userId));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ending API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
