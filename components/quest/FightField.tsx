"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import CharacterMotion from "./CharactersMotion";
import { useQuestStore } from "@/utils/stores/questStore";
import useProgressStore from "@/utils/stores/useProgressStore";

const FightField = () => {
  const { isMoving, isAttacking, isDefeated, setDefeated } = useQuestStore();
  const { progress } = useProgressStore(); // 경험치 가져오기

  useEffect(() => {
    if (progress >= 100) {
      setDefeated(true); // 경험치가 100%면 werewolf 제거
    }
  }, [progress, setDefeated]);

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

  return (
    <div className="relative w-auto h-[200px]">
      <Image
        src="/images/backgrounds/underwater-fantasy-background3.png"
        alt="field image"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* 플레이어 (이동 & 공격 반영) */}
      <CharacterMotion
        idleFrames={playerIdleFrames}
        attackFrames={playerAttackFrames}
        alt="Player"
        top="60%"
        left="30%"
        isAttacking={isAttacking}
        isMoving = {isAttacking} // 공격 상태 전달
      />

      {/* 몬스터 (웨어울프) */}
      <CharacterMotion
        idleFrames={werewolfIdleFrames}
        attackFrames={werewolfAttackFrames}
        alt="Werewolf"
        top="60%"
        left="70%"
        flip={true}
        isShaking={isAttacking}
      />
    </div>
  );
};

export default FightField;
