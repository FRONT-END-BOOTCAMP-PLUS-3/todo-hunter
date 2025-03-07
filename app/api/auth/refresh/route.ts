import { NextRequest, NextResponse } from "next/server";
import { RdAuthenticationRepository } from "@/infrastructure/repositories/RdAuthenticationRepository";
import { VerifyRefreshTokenUsecase } from "@/application/usecases/auth/VerifyRefreshTokenUsecase";
import { GenerateAccessTokenUsecase } from "@/application/usecases/auth/GenerateAccessTokenUsecase";
import { RenewRefreshTokenUsecase } from "@/application/usecases/auth/RenewRefreshTokenUsecase";

export async function POST(req: NextRequest) {
    try {
        const { loginId, refreshToken } = await req.json();
        const authenticationRepository = new RdAuthenticationRepository();
        const verifyRefreshTokenUsecase = new VerifyRefreshTokenUsecase();
        const generateAccessTokenUsecase = new GenerateAccessTokenUsecase();
        const renewRefreshTokenUsecase = new RenewRefreshTokenUsecase(authenticationRepository);

        // Refresh Token 검증
        const decodedRefreshToken = await verifyRefreshTokenUsecase.execute(refreshToken);
        let newAccessToken: string;

        if (decodedRefreshToken) {
            // Refresh Token이 유효하면 새 Access Token 발급
            newAccessToken = await generateAccessTokenUsecase.execute({ id: loginId });
        } else {
            // Refresh Token이 만료되었으면 갱신
            const newRefreshToken = await renewRefreshTokenUsecase.execute({ id: loginId });
            if (!newRefreshToken) {
                return NextResponse.json({ error: "Failed to renew refresh token" }, { status: 401 });
            }
            newAccessToken = await generateAccessTokenUsecase.execute({ id: loginId });
        }

        return NextResponse.json({ newAccessToken }, { status: 200 });
    } catch (error) {
        console.error("❌ Refresh token error", error);
        return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
    }
}
