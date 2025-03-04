"use client";

import { useEffect, useState } from "react";
import { CharacterDto } from "@/application/usecases/character/dtos";
import Status from "./_components/status";
import "./_components/character.css";


export default function CharacterPage() {
    const [character, setCharacter] = useState<CharacterDto | null>(null);

    const getCharacter = async () => {
      try{
        const res = await fetch(`/api/character`, {
            headers: {
                "user-id": "1",
            }
        });
        
        const data:CharacterDto = await res.json();
        setCharacter(data);
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
                    <p className="mr-2 text-white text-xl">{character?.progress}%</p>
                    <progress className="bg-white is-rounded-progress " value={character?.progress} max="100"></progress>
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
  