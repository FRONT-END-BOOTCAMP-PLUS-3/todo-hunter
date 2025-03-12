"use client"; // This tells Next.js to treat this as a client-side component

import { Button } from "@/components/common";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "./loading";

const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; ${
    process.env.NODE_ENV === "production" ? "secure; " : ""
  }httpOnly`;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [hasRefreshToken, setHasRefreshToken] = useState(false);

  // 서버에서 헤더를 가져오기 위해 초기 요청
  useEffect(() => {
    const checkTokens = async () => {
      const response = await fetch("/", { credentials: "include" });

      // Access-Control-Request-Headers로 전달받은 액세스 토큰 유무 여부를 boolean 값으로 저장
      const accessTokenHeader = response.headers.get("X-Has-AccessToken");
      // Access-Control-Request-Headers로 전달받은 리프레시 토큰 유무 여부를 boolean 값으로 저장
      const refreshTokenHeader = response.headers.get("X-Has-RefreshToken");

      const hasAccessToken = accessTokenHeader === "true";
      const hasRefreshToken = refreshTokenHeader === "true";

      setHasAccessToken(hasAccessToken);
      setHasRefreshToken(hasRefreshToken);
      
      setIsLoading(false); // 로딩 완료
    };
    checkTokens();
  }, []);

  const handleStartClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 링크 동작 방지

    if (hasAccessToken) {
      // accessToken이 있으면 /play/character로 이동
      window.location.href = "/play/character";
      // refreshToken만 있고 accessToken이 없으면 토큰 갱신 시도
    } else if (hasRefreshToken) {
      // refreshToken이 존재하면 서버에서 헤더 값을 가져와 refresh 요청
      const response = await fetch("/", { credentials: "include" });
      // Access-Control-Request-Headers로 전달받은 디코드된 리프레시 토큰의 id값을 저장
      const id = response.headers.get("X-Id");
      // Access-Control-Request-Headers로 전달받은 디코드된 리프레시 토큰의 loginId값을 저장
      const loginId = response.headers.get("X-LoginId");
      // Access-Control-Request-Headers로 전달받은 디코드된 리프레시 토큰 값을 저장
      const refreshToken = response.headers.get("X-RefreshToken");

      if (id && loginId && refreshToken) {
        // '/api/auth/refresh'로 id, loginId, refreshToken 전송
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, loginId, refreshToken }),
          credentials: "include",
        });

        if (refreshResponse.ok) {
          const { newAccessToken } = await refreshResponse.json();
          if (newAccessToken) {
            setCookie("accessToken", newAccessToken, parseInt(process.env.ACCESS_TOKEN_EXPIRES || "3600", 10));
            window.location.href = "/play/character"; // 액세스 토큰 발급 성공 시 '/play/character'로 이동
          } else {
            window.location.href = "/signin"; // 액세스 토큰 발급 실패 시 로그인 페이지로
          }
        } else {
          window.location.href = "/signin"; // API 응답 에러 시 로그인 페이지로
        }
      } else {
        // 헤더에서 필요한 값이 없으면 signin으로 이동
        window.location.href = "/signin";
      }
    } else {
      // accessToken도 없고 refreshToken도 없으면 /signin으로 이동
      window.location.href = "/signin";
    }
  };

  if (isLoading) {
    return <Loading color={"black"} />; // 쿠키 값을 기다리는 동안 로딩 상태 표시
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black">
      <Image src="/Images/Logo.png" width={1001} height={395} alt="TODO HUNTER ~RETURN OF SCROLL~ (투두 헌터 -리턴 오브 스크롤-)" className="p-6"/>
      <Button asChild size="L" state="success" className="mt-20 max-[1000px]:mt-[8vw] max-[380px]:w-4/5">
        <Link href={"/"} onClick={handleStartClick}>시작하기</Link>
      </Button>
    </div>
  );
}
