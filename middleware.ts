import { NextResponse, NextRequest } from "next/server";
import { getUserFromCookie } from "@/utils/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // '/play' 및 '/signin' 경로를 미들웨어가 처리하지 않도록 제외
  if (pathname === "/signin"
    || pathname === "/signup"
    || pathname === "/findid"
    || pathname.startsWith("/play")) {
    return NextResponse.next();
  }

  console.log("요청 경로:", request.nextUrl.pathname);

  const { user, response } = await getUserFromCookie(request);
  
  if (user) {
    console.log("🔑 사용자 정보:", user);

    if (pathname === "/") {
      // Access Token이 유효하거나 새로 발급된 경우 '/play'로 리다이렉트
      if (response) {
        // 새 Access Token이 설정된 응답을 사용해 리다이렉트
        const redirectResponse = NextResponse.redirect(new URL("/play", request.url));
        // response에서 쿠키를 복사
        const cookies = response.cookies.get("accessToken");
        if (cookies) {
          redirectResponse.cookies.set({
            name: "accessToken",
            value: cookies.value,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: cookies.maxAge,
          });
        }
        return redirectResponse;
      }
      return NextResponse.redirect(new URL("/play", request.url));
    }
    // 루트가 아닌 경우엔 아무 리다이렉트 없이 요청한 페이지로 이동
    return NextResponse.next();
  } else {
    console.log("❌ 인증되지 않은 사용자");
    // 인증되지 않은 경우 '/signin'으로 리다이렉트
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|icons/|images/).*)"], // _next, /api, /icons, /images 경로 제외
};
