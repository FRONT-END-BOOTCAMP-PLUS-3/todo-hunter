import { CheckVerifyCodeUsecase } from "@/application/usecases/auth/CheckVerifyCodeUsecase";
import { DeleteVerifyCodeUsecase } from "@/application/usecases/auth/DeleteVerifyCodeUsecase";
import { RdVerificationRepository } from "@/infrastructure/repositories/RdVerificationRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
        // Client Request json parsed
        const { email, verificationCode } = await req.json();

        console.log("Received email:", email); // 디버깅용 코드
        console.log("Received verificationCode:", verificationCode); // 디버깅용 코드
        
        // 2차 유효성 검사
        if(!email || !verificationCode ) {
            return NextResponse.json({error: "이메일과 인증 코드를 입력해야합니다."}, {status:400});
        } 

        // Repository 
        const verificationRepository = new RdVerificationRepository();
        
        // UseCases (DI적용) 
        const checkCodeUsecase = new CheckVerifyCodeUsecase(verificationRepository);
        const deleteCodeUsecase = new DeleteVerifyCodeUsecase(verificationRepository);

        // 인증 상태
        const isValid = await checkCodeUsecase.execute(email, verificationCode);

        // 인증 코드 만료 여부 확인 (유효기간 체크)
        const expirationTime = await verificationRepository.getVerificationCodeExpiration(email);
        if (expirationTime === null) {
            // 만료 시간이 설정되지 않은 경우
            if (isValid) {
                // 인증 코드가 유효한 경우
                await deleteCodeUsecase.execute(email);
                return NextResponse.json({ message: "인증이 완료되었습니다.", isVerified: true }, { status: 200 });
            } else {
                return NextResponse.json({ error: "인증 코드가 잘못되었습니다.", isVerified: false }, { status: 400 });
            }
        }


        // 만료 시간이 설정되어 있는 경우
        const currentTime = new Date().getTime();
        if (currentTime > expirationTime) {
            return NextResponse.json({ error: "인증 코드가 만료되었습니다.", isVerified: false }, { status: 410 });
        }

        // 코드 인증 성공 시
        if (isValid) {
            await deleteCodeUsecase.execute(email);
            return NextResponse.json({ message: "인증이 완료되었습니다.", isVerified: true }, { status: 200 });
        }
        // 코드 인증 실패시
        else {
            return NextResponse.json({ error: "인증 코드가 잘못되었습니다.", isVerified: false }, { status: 400 });
        }

        // 서버 오류 시
    } catch (error) {
        console.error("❌ 인증 코드 검증 오류:", error);
        return NextResponse.json({error: "서버 오류 발생"}, {status: 500});
    }
};