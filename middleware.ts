import { NextRequest, NextResponse } from "next/server";
import { VerifyAccessTokenUsecase } from "@/application/usecases/auth/VerifyAccessTokenUsecase";
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
    const refreshToken = await authenticationRepository.getRefreshToken(loginId);
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Refresh Token 검증 및 Access Token 재발급은 route에서 처리
    const response = await fetch(new URL("/api/auth/refresh", req.url), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginId, refreshToken }),
    });

    if (!response.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const { newAccessToken } = await response.json();
    const nextResponse = NextResponse.next();
    nextResponse.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES || "3600", 10),
    });
    return nextResponse;
}

export const config = {
    matcher: ["/((?!login|_next).*)"],
};