import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CharacterProps {
  idleFrames: string[];
  attackFrames: string[];
  alt: string;
  top: string;
  left: string;
  flip?: boolean;
  frameRate?: number;
  isDefeated?: boolean; // 패배 애니메이션 상태 추가
  isMoving?: boolean; // 이동 상태 추가
  isAttacking?: boolean; // 공격 상태 추가
  onMoveComplete?: () => void; // 이동 완료 시 호출할 함수
  isShaking?: boolean; // 🔥 추가: 진동 여부 토큰
}

const CharacterMotion: React.FC<CharacterProps> = ({
  idleFrames,
  attackFrames,
  alt,
  top,
  left,
  flip = false,
  frameRate = 100,
  isMoving = false,
  isAttacking = false,
  isDefeated = false,
  onMoveComplete,
  isShaking = false, // 🔥 기본값 false
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [opacity, setOpacity] = useState(1); // 투명도 상태 추가

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const frames = isAttacking ? attackFrames : idleFrames;

    if (isMoving) {
      // 플레이어가 몬스터 위치로 이동하는 애니메이션
      setPosition({ top: "60%", left: "65%" }); // 몬스터 근처로 이동
      setTimeout(() => {
        onMoveComplete?.();
        setPosition({ top, left }); // 원위치로 이동
      }, 3000); // 500ms 후에 공격 시작
    }

    if (isAttacking) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, frameRate);
    }

    if (isDefeated) {
      // werewolf가 사라지는 애니메이션
      setOpacity(1);
      setTimeout(() => {
        setOpacity(0); // 서서히 사라지기
      }, 500); // 0.5초 후 사라짐
    }

    return () => clearInterval(interval);
  }, [isAttacking, isMoving, frameRate, idleFrames.length, attackFrames.length, top, left]);

  return (
    <div
      className="absolute cursor-pointer transition-all duration-500"
      style={{
        top,
        left,
        transform: `translate(-50%, -50%) ${flip ? "scaleX(-1)" : ""}`,
        opacity, //  패배 시 투명도 조절
        transition: "opacity 0.5s ease-out", //  자연스럽게 사라지는 효과
        animation: isShaking ? "shake 0.5s infinite" : "none", // 🔥 토큰을 기반으로 진동 효과 적용
      }}
    >
      <Image
        src={isAttacking ? attackFrames[currentFrame] : idleFrames[currentFrame]}
        alt={alt}
        width={120}
        height={120}
      />
    </div>
  );
};

export default CharacterMotion;
