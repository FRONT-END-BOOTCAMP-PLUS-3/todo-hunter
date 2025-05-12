import type { Metadata } from "next";
import "./globals.css";
import "@hackernoon/pixel-icon-library/fonts/iconfont.css";
import InstallPrompt from "@/components/installPrompt/InstallPrompt";
import NavigationWrapper from "@/components/common/NavigationWrapper"; // 클라이언트 전용 네비게이션
import Header from "./header";
import { Toaster } from "@/components/common";

export const metadata: Metadata = {

  title: {
    default: "투두헌터", // ✅ Google 검색에서 보이는 타이틀
    template: "%s | TODO HUNTER", // 서브 페이지에 타이틀 추가 시
  },
  applicationName: "TODO HUNTER",
  description: "TODO HUNTER의 공식 웹사이트입니다.",
  keywords: ["투두헌터", "TODO-HUNTER", "투두리스트", "게임형 투두리스트", "TODO", "일정관리"],
  openGraph: { // SNS 공유 메시지에 표시될 내용
    title: "TODO HUNTER - 일상의 모험을 시작하세요!", // SNS에서 표시될 제목
    description: "TODO HUNTER의 공식 웹사이트입니다.", // SNS에서 표시될 설명
    url: "https://todo-hunter.com",
    siteName: "TODO HUNTER",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Header />
      <body className={"antialiased flex flex-col min-h-screen"}>
        <main className="flex-1 flex flex-col">
          <InstallPrompt />
          {children}
        </main>
        <Toaster position="top-center" />
        <NavigationWrapper /> {/* 클라이언트 전용 네비게이션 */}
      </body>
    </html>
  );
}
