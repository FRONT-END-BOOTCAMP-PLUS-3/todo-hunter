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
  isMoving?: boolean;
  isAttacking?: boolean;
  isDefeated?: boolean; // 패배 애니메이션 상태 추가
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
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [opacity, setOpacity] = useState(1); // 투명도 상태 추가

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const frames = isAttacking ? attackFrames : idleFrames;

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
  }, [isAttacking, isDefeated, frameRate, idleFrames.length, attackFrames.length]);

  return (
    <div
      className="absolute cursor-pointer transition-all duration-500"
      style={{
        top,
        left,
        transform: `translate(-50%, -50%) ${flip ? "scaleX(-1)" : ""}`,
        opacity, //  패배 시 투명도 조절
        transition: "opacity 0.5s ease-out", //  자연스럽게 사라지는 효과
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
