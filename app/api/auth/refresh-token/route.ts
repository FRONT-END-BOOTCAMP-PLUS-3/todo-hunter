// /app/api/auth/refresh-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { VerifyRefreshTokenUsecase } from "@/application/usecases/auth/VerifyRefreshTokenUsecase";
import { GenerateAccessTokenUsecase } from "@/application/usecases/auth/GenerateAccessTokenUsecase";
import { RdAuthenticationRepository } from "@/infrastructure/repositories/RdAuthenticationRepository";
import { RenewRefreshTokenUsecase } from "@/application/usecases/auth/RenewRefreshTokenUsecase";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const { accessToken } = await req.json(); // 클라이언트가 만료된 accessToken을 보냄

        // Redis 인증 리포지토리 생성
        const authenticationRepository = new RdAuthenticationRepository();
        // Refresh Token 검증
        const verifyRefreshTokenUsecase = new VerifyRefreshTokenUsecase();
        
        const generateAccessTokenUsecase = new GenerateAccessTokenUsecase();
        const renewRefreshTokenUsecase = new RenewRefreshTokenUsecase(authenticationRepository);
        
        // Access Token에서 loginId 추출 (만료되어도 디코딩 가능)
        const decodedAccessToken = jwt.decode(accessToken) as { id?: string };
        if (!decodedAccessToken || !decodedAccessToken.id) {
            return NextResponse.json({ error: "유효하지 않은 Access Token입니다." }, { status: 401 });
        }
        const loginId = decodedAccessToken.id;

        // Redis에서 Refresh Token 가져오기
        const existingRefreshToken = await authenticationRepository.getRefreshToken(loginId);
        if (!existingRefreshToken) {
            return NextResponse.json({ error: "Refresh Token이 존재하지 않습니다. 다시 로그인해주세요." }, { status: 401 });
        }

        // Refresh Token 검증
        const decodedRefreshToken = await verifyRefreshTokenUsecase.execute(existingRefreshToken);
        let newAccessToken: string;

        if (decodedRefreshToken) {
            // Refresh Token이 유효하면 새 Access Token 발급
            newAccessToken = await generateAccessTokenUsecase.execute({ id: loginId });
        } else {
            // Refresh Token이 만료되었으면 새로 발급
            const newRefreshToken = await renewRefreshTokenUsecase.execute({ id: loginId });
            if (!newRefreshToken) {
                return NextResponse.json({ error: "Refresh Token 갱신에 실패했습니다." }, { status: 500 });
            }
            // 새 Refresh Token으로 새 Access Token 발급
            newAccessToken = await generateAccessTokenUsecase.execute({ id: loginId });
        }

        return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
    } catch (error) {
        console.error("❌ Refresh Token 오류", error);
        return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
