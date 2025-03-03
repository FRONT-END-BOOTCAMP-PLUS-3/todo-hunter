"use client";

import { useEffect, useState } from "react";
import { CharacterDto } from "@/application/usecases/character/dtos";
import Navigation from "@/components/common/Navigation";
import Status from "./component/status";

export default function CharacterPage() {
    const [character, setCharacter] = useState<CharacterDto | null>(null);

    const getCharacter = async () => {
      try{
        const res = await fetch('http://localhost:3000/api/character',{
            method: 'GET',      
        });
        if(!res.ok){
          throw new Error('Network response was not ok');
        }
        const data:CharacterDto = await res.json();
        setCharacter(data);
        console.log(data);
      }catch(error){
        console.log(error);
      }
    }

    useEffect(() => {
    //   getCharacter();
    }, []);


    return (
        <div className="character-page-background">
            <div className="flex flex-col items-center">
                <p className="mb-2 mt-10 text-xl text-white">userName님, 오늘의 경험치에요!</p>

                <div className="flex">
                    <p className="mr-2 text-white text-xl">{10}%</p>
                    <progress className="bg-white is-rounded-progress " value={50} max="100"></progress>
                </div>
                
            </div>
            <div>캐릭터 이미지</div>
            <Status status = {20}/>
            <Navigation />
        </div>
    );
  }
  