import { NextRequest, NextResponse } from "next/server";
import { JWTPayload } from "jose";
import { VerifyAccessTokenUsecase } from "@/application/usecases/auth/VerifyAccessTokenUsecase";
import { VerifyRefreshTokenUsecase } from "@/application/usecases/auth/VerifyRefreshTokenUsecase";
import { GenerateAccessTokenUsecase } from "@/application/usecases/auth/GenerateAccessTokenUsecase";

// 사용자 정보 타입 정의 (재사용 가능)
interface UserPayload extends JWTPayload {
  loginId: string;
  nickname: string;
  createdAt: string;
}

// 쿠키로부터 유저 정보 가져오기 (미들웨어용)
export async function getUserFromCookie(
  req: NextRequest,
  verifyAccessTokenUsecase = new VerifyAccessTokenUsecase(),
  verifyRefreshTokenUsecase = new VerifyRefreshTokenUsecase(),
  generateAccessTokenUsecase = new GenerateAccessTokenUsecase(),
): Promise<{ user: UserPayload | null; response?: NextResponse }> {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    // const refreshToken = await rdAuthenticationRepository.getRefreshToken(loginId); // 서버에서 Refresh Token 조회
    const refreshToken = req.cookies.get("refreshToken")?.value; // 쿠키에서 Refresh Token 조회

    if (!accessToken && refreshToken) {
      // Access Token이 없고 Refresh Token이 있는 경우
      const refreshPayload = await verifyRefreshTokenUsecase.execute(refreshToken);
      if (!refreshPayload) return { user: null };

      // 새로운 Access Token 생성
      const newAccessToken = await generateAccessTokenUsecase.execute({
        id: refreshPayload.id as number, // id는 refreshPayload에서 추출
        loginId: refreshPayload.loginId as string, // loginId는 refreshPayload에서 추출
      });

      // 새 Access Token을 쿠키에 설정한 응답 생성
      const response = NextResponse.next();
      response.cookies.set({
        name: "accessToken",
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES || "3600", 10), // 유효기간 (초 단위)
      });

      return { user: refreshPayload as UserPayload, response };
    }

    if (!accessToken) {
      return { user: null }; // Access Token 없으면 null 반환
    }
    
    // Access Token 검증 (유효하면 바로 반환)
    const payload = await verifyAccessTokenUsecase.execute(accessToken);
    if (payload) {
      return { user: payload as UserPayload };
    }

    // 서버에서 Refresh Token 조회 (예외 처리)
    if (!refreshToken) return { user: null };

    // 서버에서 Refresh Token 조회
    const refreshPayload = await verifyRefreshTokenUsecase.execute(refreshToken);
    if (!refreshPayload) return { user: null };

    // 새로운 Access Token 생성
    const newAccessToken = await generateAccessTokenUsecase.execute({
      id: refreshPayload.id as number, // id는 refreshPayload에서 추출
      loginId: refreshPayload.id as string, // loginId는 refreshPayload에서 추출
    });

    // 새 Access Token을 쿠키에 설정한 응답 생성
    const response = NextResponse.next();
    response.cookies.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // maxAge: 60 * 60, // 1시간 (환경 변수에 맞게 조정)
    });

    return { user: refreshPayload as UserPayload, response };
  } catch (error) {
    console.error("❌ 쿠키에서 사용자 정보를 가져오는 중 오류 발생", error);
    return { user: null };
  }
}

export async function getUserFromRequest(req: NextRequest) {
  const { user } = await getUserFromCookie(req);
  return user?.id ?? null;
}