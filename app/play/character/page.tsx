"use client";

import { useEffect } from "react";
import Status from "@/app/play/character/_components/status";
import "@/app/play/character/_components/character.css";
import Character from "./_components/character";
import characterStore from "@/utils/stores/characterStore";


export default function CharacterPage() {
    const { characterData, fetchCharacterData } = characterStore();
    
    useEffect(() => {
        fetchCharacterData();
    }, [fetchCharacterData]);

    return (
        <div className="character-page-background">
            <div className="flex flex-col items-center">
                <p className="mb-2 mt-10 text-xl text-white">{characterData?.nickname}님, 오늘의 경험치에요!</p>
                <div className="flex">
                    <p className="mr-2 text-white text-xl">{characterData?.progress}%</p>
                    <progress className="bg-white is-rounded-progress " value={characterData?.progress} max="100"></progress>
                </div>
            </div>
            <Character />
            {characterData && (
                <Status
                    str={characterData.str}
                    int={characterData.int}
                    emo={characterData.emo}
                    fin={characterData.fin}
                    liv={characterData.liv}
                />
            )}       
         </div>
    );
  }
  