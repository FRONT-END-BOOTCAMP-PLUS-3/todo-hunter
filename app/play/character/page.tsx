"use client";

import Status from "@/app/play/character/_components/status";
import "@/app/play/character/_components/character.css";
import Character from "./_components/character";
import { useUserStore } from "@/utils/stores/userStore";
import { Button } from "@/components/common";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import ProgressBar from "./_components/ProgressBar";
import Image from "next/image";

export default function CharacterPage() {
    const router = useRouter();
    const pathname = usePathname();
    const { id, nickname, progress, str, int, emo, fin, liv, fetchUser } = useUserStore();

    useEffect(() => {
        if (pathname === "/play/character" && id) {
            fetchUser();
        }
    }, [pathname, id, fetchUser]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/signout", { method: "POST" });
            router.push("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <>
        <div className="relative w-full h-[91vh] overflow-hidden"> 
            <Image
                src="/images/backgrounds/Character-Page-Bg.webp"
                // src="/images/backgrounds/Character-Page-Bg.png"
                alt="캐릭터 페이지 배경"
                fill
                loading="eager"
                className="object-cover z-[-1]"
                quality={70}
            />
            <Button className="absolute top-8 right-5" size={"S"} state={"error"} onClick={handleLogout}>로그아웃</Button>
            <Suspense>
                <ProgressBar nickname={nickname} progress={progress} />
            </Suspense>
            <div className="mt-10">
                <Character />
            </div>
            <Suspense>
                <Status
                    str={str ?? 0}
                    int={int ?? 0}
                    emo={emo ?? 0}
                    fin={fin ?? 0}
                    liv={liv ?? 0}
                />
            </Suspense>
        </div>
        </>
    );
}
