import { GenerateVerifyCodeUsecase } from "@/application/usecases/auth/GenerateVerifyCodeUsecase";
import { SendSignUpEmailUsecase } from "@/application/usecases/auth/SendSignUpEmailUsecase";

import { RdVerificationRepository } from "@/infrastructure/repositories/RdVerificationRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {
    const { email } = await req.json();

    if (!email) {
      // 입력 에러 시
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Infrastructure Layer DI 의존성 주입
    const generateVerifyCodeUsecase = new GenerateVerifyCodeUsecase();
    const verificationRepository = new RdVerificationRepository();

    const sendSignUpEmailUsecase = new SendSignUpEmailUsecase(
      generateVerifyCodeUsecase,
      verificationRepository
    );

    //usecase 실행
    await sendSignUpEmailUsecase.execute(email);

    // 성공 시 확인 메시지
    return NextResponse.json(
      { message: "Email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    // server에러 코드 및 메시지
    console.error("Email send Error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
