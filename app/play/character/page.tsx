"use client";

import Status from "@/app/play/character/_components/status";
import "@/app/play/character/_components/character.css";
import Character from "./_components/character";
import { useUserStore } from "@/utils/stores/userStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CharacterPage() {
    const pathname = usePathname();
    const { id, nickname, progress, str, int, emo, fin, liv, fetchCharacter } = useUserStore();

    useEffect(() => {
        if (pathname === "/play/character" && id) {
            fetchCharacter();
        }
    }, [pathname, id, fetchCharacter]); 

    return (
        <div className="character-page-background">
            <div className="flex flex-col items-center">
                <p className="mb-2 mt-10 text-xl text-white">{nickname}님, 오늘의 경험치에요!</p>
                <div className="flex">
                    <p className="mr-2 text-white text-xl">{progress}%</p>
                    <progress className="bg-white is-rounded-progress" value={progress} max="100"></progress>
                </div>
            </div>
            <Character />
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
