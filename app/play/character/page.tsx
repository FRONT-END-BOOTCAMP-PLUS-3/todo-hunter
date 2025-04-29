"use client";

import Status from "@/app/play/character/_components/status";
import "@/app/play/character/_components/character.css";
import Character from "./_components/character";
import { useUserStore } from "@/utils/stores/userStore";
import { Button } from "@/components/common";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

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
            <div className="mt-10 mr-7 flex justify-end">
                <Button size={"S"} state={"error"} onClick={handleLogout}>로그아웃</Button>
            </div>
            <div className="flex flex-col items-center">
                <p className="mb-2 mt-4 text-xl text-white text-center">{nickname}님, 오늘의 경험치에요!</p>
                <div className="flex items-center pl-5">
                    <p className="mr-2 text-white text-xl">{progress}%</p>
                    <progress className="bg-white is-rounded-progress" value={progress} max="100"></progress>
                </div>
            </div>
            <div style={{ marginTop: "-50px" }}>
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
