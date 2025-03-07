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
  isMovingForward?: boolean;
  isAttacking?: boolean;
  isDefeated?: boolean;
  isShaking?: boolean;
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
  isMovingForward = true,
  isAttacking = false,
  isDefeated = false,
  isShaking = false,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [position, setPosition] = useState({ top, left });
  const [opacity, setOpacity] = useState(1);
  const [shake, setShake] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const frames = isAttacking ? attackFrames : idleFrames;

    if (isMoving) {
      // 이동 방향에 따라 위치 변경
      setPosition({
        top: "60%",
        left: isMovingForward ? "65%" : "30%", // 앞으로 이동 or 뒤로 복귀
      });

      // 뒤로 이동일 경우 0.6초 후 원래 자리로 복귀
      if (!isMovingForward) {
        setTimeout(() => {
          setPosition({ top, left });
        }, 600);
      }
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

    if (isShaking) {
      setShake("translateX(-3px)");
      setTimeout(() => setShake("translateX(3px)"), 100);
      setTimeout(() => setShake("translateX(-3px)"), 200);
      setTimeout(() => setShake("translateX(3px)"), 300);
      setTimeout(() => setShake("translateX(0)"), 400);
    } else {
      setShake("");
    }

    return () => clearInterval(interval);
  }, [isAttacking, isDefeated, isMoving, isMovingForward, isShaking]);

  return (
    <div
      className="absolute cursor-pointer transition-all duration-500"
      style={{
        top: position.top,
        left: position.left,
        transform: `translate(-50%, -50%) ${flip ? "scaleX(-1)" : ""} ${shake}`,
        opacity,
        animation: isShaking ? "shake 0.5s infinite" : "none", //  진동 효과
      }}
    >
      <Image src={isAttacking ? attackFrames[currentFrame] : idleFrames[currentFrame]} alt={alt} width={120} height={120} />
    </div>
  );
};

export default CharacterMotion;
