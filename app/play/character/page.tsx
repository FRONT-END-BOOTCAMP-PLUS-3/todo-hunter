"use client";

import { useEffect, useState } from "react";
import { CharacterDto } from "@/application/usecases/character/dtos";
import Status from "@/app/play/character/_components/status";
import "@/app/play/character/_components/character.css";
import useProgressStore from "@/utils/stores/useProgressStore";


export default function CharacterPage() {
    const [character, setCharacter] = useState<CharacterDto | null>(null);
    const { progress, setProgress } = useProgressStore();


    const getCharacter = async () => {
      try{
        const res = await fetch(`/api/character`, {
            headers: {
                "user-id": "1", // zustand로 관리할 예정
            }
        });
        
        const data:CharacterDto = await res.json();
        setCharacter(data);
        setProgress(data.progress ?? 0);
      }catch(error){
        console.log(error);
      }
    }

    useEffect(() => {
        getCharacter();
    }, []);

    return (
        <div className="character-page-background">
            <div className="flex flex-col items-center">
                <p className="mb-2 mt-10 text-xl text-white">{character?.nickname}님, 오늘의 경험치에요!</p>
                <div className="flex">
                    <p className="mr-2 text-white text-xl">{progress}%</p>
                    <progress className="bg-white is-rounded-progress " value={progress} max="100"></progress>
                </div>
            </div>
            <div>캐릭터 이미지</div>
            {character && (
                <Status
                    str={character.str}
                    int={character.int}
                    emo={character.emo}
                    fin={character.fin}
                    liv={character.liv}
                />
            )}       
         </div>
    );
  }
  