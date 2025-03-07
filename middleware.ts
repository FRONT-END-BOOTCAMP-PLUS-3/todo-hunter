import { NextRequest, NextResponse } from "next/server";
import { VerifyAccessTokenUsecase } from "@/application/usecases/auth/VerifyAccessTokenUsecase";
import { VerifyRefreshTokenUsecase } from "@/application/usecases/auth/VerifyRefreshTokenUsecase";
import { GenerateAccessTokenUsecase } from "@/application/usecases/auth/GenerateAccessTokenUsecase";
import { RenewRefreshTokenUsecase } from "@/application/usecases/auth/RenewRefreshTokenUsecase";
import { RdAuthenticationRepository } from "@/infrastructure/repositories/RdAuthenticationRepository";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const verifyAccessTokenUsecase = new VerifyAccessTokenUsecase();
    const decodedAccessToken = await verifyAccessTokenUsecase.execute(accessToken);

    if (decodedAccessToken) {
        // Access Token이 유효하면 Bearer 헤더 추가
        const response = NextResponse.next();
        response.headers.set("Authorization", `Bearer ${accessToken}`);
        return response;
    }

    // Access Token 만료 시
    const loginId = (jwt.decode(accessToken) as { id?: string })?.id;
    if (!loginId) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const authenticationRepository = new RdAuthenticationRepository();
    const verifyRefreshTokenUsecase = new VerifyRefreshTokenUsecase();
    const generateAccessTokenUsecase = new GenerateAccessTokenUsecase();
    const renewRefreshTokenUsecase = new RenewRefreshTokenUsecase(authenticationRepository);

    const refreshToken = await authenticationRepository.getRefreshToken(loginId);
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

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
            return NextResponse.redirect(new URL("/login", req.url));
        }
        newAccessToken = await generateAccessTokenUsecase.execute({ id: loginId });
    }

    const response = NextResponse.next();
    // response.headers.set("Authorization", `Bearer ${newAccessToken}`);
    response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES || "3600", 10),
    });
    return response;
}

export const config = {
    matcher: ["/((?!login|_next).*)"],
};