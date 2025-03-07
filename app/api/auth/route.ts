import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/utils/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromCookie(req);

    if (!user) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "알 수 없는 오류 발생" },
      { status: 500 }
    );
  }
}
