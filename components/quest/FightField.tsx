"use client";

import React from "react";
import Image from "next/image";
import Character from "./testCharacterM";

const FightField = () => {
    return (
        <div className="relative w-auto h-[150px]">
        <Image
          src="/images/backgrounds/underwater-fantasy-background3.png"
          alt="field image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
          <div className="absolute bottom-0 left-0 w-1/4">
                <Character width={170} height={170} images={[
                    '/images/characters/player/idle01.png',
                    '/images/characters/player/idle02.png',
                    '/images/characters/player/idle03.png',
                    '/images/characters/player/idle04.png',
                    '/images/characters/player/idle05.png',
                    '/images/characters/player/idle06.png'
                ]} />
            </div>
            <div className="absolute bottom-3 right-12 w-1/4">
                <Character width={180} height={180} images={[
                    '/images/characters/werewolf/werewolf-idle1.png',
                    '/images/characters/werewolf/werewolf-idle2.png',
                    '/images/characters/werewolf/werewolf-idle3.png',
                    '/images/characters/werewolf/werewolf-idle4.png',
                    '/images/characters/werewolf/werewolf-idle5.png'
                ]} />
            </div>


      </div>);
};

export default FightField;