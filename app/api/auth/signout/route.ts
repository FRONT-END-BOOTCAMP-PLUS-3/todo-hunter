import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });

    // 쿠키를 빈 값으로 설정하고 만료 날짜를 과거로 지정하여 삭제
    response.cookies.set("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서만 Secure 적용
        path: "/", // 모든 경로에서 사용 가능
        expires: new Date(0), // 만료 시간을 과거로 설정하여 쿠키 삭제
    });

    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0),
    });

    return response;
}
