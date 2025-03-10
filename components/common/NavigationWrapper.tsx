"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/common/Navigation";
import { useEffect, useState } from "react";
import { MENUS } from "@/constants/menu";

export default function NavigationWrapper() {
  const pathname = usePathname();
  const [isErrorPage, setIsErrorPage] = useState(false);

  // 404 및 500 에러 페이지 여부 감지
  useEffect(() => {
    const pageContent = document.body.innerText || "";
    if (
      document.title.includes("404") ||
      pageContent.includes("페이지를 찾을 수 없습니다") || // 404 페이지 감지
      document.title.includes("500") ||
      pageContent.includes("서버 에러가 발생했습니다") || // 500 에러 감지
      pageContent.includes("Internal Server Error")
    ) {
      setIsErrorPage(true);
    } else {
      setIsErrorPage(false);
    }
  }, [pathname]);

  // 네비게이션을 숨길 페이지 목록
  const hiddenRoutes = ["/", "/signin", "/signup", "/findid", "/findpw", "/error", "/not-found"];
  const shouldHideNavigation = hiddenRoutes.includes(pathname) || isErrorPage;

  if (shouldHideNavigation) return null; // 네비게이션 숨김

  // 현재 경로에 따라 selectedMenu 설정
  const getSelectedMenu = () => {
    const matchedMenu = MENUS.find((menu) => pathname.includes(menu.menu));
    return matchedMenu ? matchedMenu.menu : "character"; // 기본값 "character"
  };

  return <Navigation selectedMenu={getSelectedMenu()} className="fixed bottom-0 w-full" />;

  
}
