// 현재 사용 안함, 차후 확장시 사용할 수 있음
import { NextRequest, NextResponse } from "next/server";
import { RdAuthenticationRepository } from "@/infrastructure/repositories/RdAuthenticationRepository";
import { VerifyRefreshTokenUsecase } from "@/application/usecases/auth/VerifyRefreshTokenUsecase";
import { GenerateAccessTokenUsecase } from "@/application/usecases/auth/GenerateAccessTokenUsecase";
import { RenewRefreshTokenUsecase } from "@/application/usecases/auth/RenewRefreshTokenUsecase";

export async function POST(req: NextRequest) {
    try {
        const { id, loginId, refreshToken } = await req.json();
        const authenticationRepository = new RdAuthenticationRepository();
        const verifyRefreshTokenUsecase = new VerifyRefreshTokenUsecase();
        const generateAccessTokenUsecase = new GenerateAccessTokenUsecase();
        const renewRefreshTokenUsecase = new RenewRefreshTokenUsecase(authenticationRepository);

        // Refresh Token 검증
        const decodedRefreshToken = await verifyRefreshTokenUsecase.execute(refreshToken);
        let newAccessToken: string;

        if (decodedRefreshToken) {
            // Refresh Token이 유효하면 새 Access Token 발급
            newAccessToken = await generateAccessTokenUsecase.execute({ id: id, loginId: loginId });
        } else {
            // Refresh Token이 만료되었으면 갱신
            const newRefreshToken = await renewRefreshTokenUsecase.execute({ id: id, loginId: loginId });
            if (!newRefreshToken) {
                return NextResponse.json({ error: "Failed to renew refresh token" }, { status: 401 });
            }
            newAccessToken = await generateAccessTokenUsecase.execute({ id: id, loginId: loginId });
        }

        // 쿠키 설정
        const response = NextResponse.json({ newAccessToken }, { status: 200 });
        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true, // XSS 방지
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/", // 모든 경로에서 사용 가능
            maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES || "3600", 10), // 유효기간 (초 단위)
        });

        return response;
    } catch (error) {
        console.error("❌ Refresh token error", error);
        return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
    }
}