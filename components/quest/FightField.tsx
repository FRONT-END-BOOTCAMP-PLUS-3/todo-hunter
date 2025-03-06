"use client";

import React from "react";
import Image from "next/image";
import CharacterMotion from "./CharactersMotion";

const FightField = ({ isAttacking }: { isAttacking: boolean }) => {
  const playerIdleFrames = [
    "/images/characters/player/idle01.png",
    "/images/characters/player/idle02.png",
    "/images/characters/player/idle03.png",
    "/images/characters/player/idle04.png",
  ];

  const playerAttackFrames = [
    "/images/characters/player/attack1.png",
    "/images/characters/player/attack2.png",
    "/images/characters/player/attack3.png",
    "/images/characters/player/attack4.png",
  ];

  const werewolfIdleFrames = [
    "/images/characters/werewolf/werewolf-idle1.png",
    "/images/characters/werewolf/werewolf-idle2.png",
    "/images/characters/werewolf/werewolf-idle3.png",
  ];

  const werewolfAttackFrames = [
    "/images/characters/werewolf/werewolf-attack1.png",
    "/images/characters/werewolf/werewolf-attack2.png",
    "/images/characters/werewolf/werewolf-attack3.png",
    "/images/characters/werewolf/werewolf-attack4.png",
  ];

  return (
    <div className="relative w-auto h-[200px]">
      <Image
        src="/images/backgrounds/underwater-fantasy-background3.png"
        alt="field image"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* 플레이어 */}
      <CharacterMotion
        idleFrames={playerIdleFrames}
        attackFrames={playerAttackFrames}
        alt="Player"
        top="60%"
        left="30%"
        isAttacking={isAttacking} // 공격 상태 전달
      />

      {/* 몬스터 (웨어울프) */}
      <CharacterMotion
        idleFrames={werewolfIdleFrames}
        attackFrames={werewolfAttackFrames}
        alt="Werewolf"
        top="60%"
        left="70%"
        flip={true}
      />
    </div>
  );
};

export default FightField;
