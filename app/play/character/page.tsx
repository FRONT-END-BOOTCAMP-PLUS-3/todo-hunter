"use client";

import Status from "@/app/play/character/_components/status";
import "@/app/play/character/_components/character.css";
import Character from "./_components/character";
import { useUserStore } from "@/utils/stores/userStore";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";

export default function CharacterPage() {
    const router = useRouter(); // Next Route 호출
    const pathname = usePathname();
    const { id, nickname, progress, str, int, emo, fin, liv, fetchUser } = useUserStore();

    useEffect(() => {
        if (pathname === "/play/character" && id) {
            fetchUser();
        }
    }, [pathname, id, fetchUser]); 

    const handleLogout = async () => {
        try {
            // 서버에 로그아웃 요청
            await fetch("/api/auth/signout", { method: "POST" });

            // 루트("/") 페이지로 이동
            router.push("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <div className="character-page-background">
            <Button className="absolute top-8 right-5" size={"S"} state={"error"} onClick={handleLogout}>로그아웃</Button>
            <div className="flex flex-col items-center">
                <p className="mb-2 mt-20 text-xl text-white text-center">{nickname}님, 오늘의 경험치에요!</p>
                <div className="flex items-center w-full pl-5 pr-5 min-[360px]:pl-10 min-[360px]:pr-10 min-[480px]:pl-20 min-[480px]:pr-20 min-[720px]:pl-40 min-[720px]:pr-40">
                    <p className="mr-2 text-white text-xl">{progress}%</p>
                    <progress className="bg-white is-rounded-progress w-full" value={progress} max="100"></progress>
                </div>
            </div>
            <div style={{ marginTop: "-20px" }}>
            <Character />
            </div>
            <Status
                str={str ?? 0}
                int={int ?? 0}
                emo={emo ?? 0}
                fin={fin ?? 0}
                liv={liv ?? 0}
            />
        </div>
    );
}
