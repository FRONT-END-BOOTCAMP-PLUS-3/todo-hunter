"use client";

import { useEffect, useState } from "react";
import { EndingDTO } from "@/application/usecases/ending/dtos";
import {
  EndingState,
  FADE_STEP_DURATION,
  TOAST_DELAY,
  TOTAL_FADE_DURATION,
} from "@/constants";
import Navigation from "@/components/common/Navigation";
import { Toaster } from "@/components/common";
import { toast } from "sonner";
import { EndingImage, EndingScriptBox } from "@/app/play/ending/_components";

const EndingPage = () => {
  const [endingData, setEndingData] = useState<EndingDTO | null>(null);
  const [fadeStep, setFadeStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEndingData = async () => {
      try {
        const response = await fetch("/api/ending", {
          headers: {
            "X-User-Id": "1", // 추후 zustand 속 ID로 대체 필요
          },
        });

        if (!response.ok) {
          throw new Error("엔딩 정보를 가져오는데 실패했습니다.");
        }

        const data = await response.json();
        setEndingData(data);

        // 단계적 페이드인 시작
        const fadeInterval = setInterval(() => {
          setFadeStep((prev) => {
            if (prev >= 7) {
              clearInterval(fadeInterval);
              return 7;
            }
            return prev + 1;
          });
        }, FADE_STEP_DURATION);

        // 토스트는 페이드인이 완료된 후 표시
        setTimeout(() => {
          toast("🏆 새로운 칭호를 획득했습니다!", {
            duration: 3000,
          });
          setTimeout(() => {
            toast(
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold">
                  {data.achievableTitle.titleName}
                </p>
                <p className="text-sm text-gray-500">
                  {data.achievableTitle.description}
                </p>
              </div>
            );
          }, 1000);
        }, TOTAL_FADE_DURATION + TOAST_DELAY);

        return () => clearInterval(fadeInterval);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        );
        setFadeStep(7); // 에러 시 바로 표시
      }
    };

    fetchEndingData();
  }, []);

  const getOverlayClass = () => {
    switch (fadeStep) {
      case 0:
        return "opacity-100";
      case 1:
        return "opacity-90";
      case 2:
        return "opacity-75";
      case 3:
        return "opacity-60";
      case 4:
        return "opacity-45";
      case 5:
        return "opacity-30";
      case 6:
        return "opacity-15";
      case 7:
        return "opacity-0";
      default:
        return "opacity-100";
    }
  };

  return (
    <>
      <Toaster />
      <div className="relative min-h-screen bg-black py-3">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
          {error ? (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <p className="text-red-500">{error}</p>
            </div>
          ) : !endingData ? (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <p>로딩 중...</p>
            </div>
          ) : (
            <>
              <EndingImage image={endingData.endingImage} />

              <EndingScriptBox script={endingData.endingPrompt} />

              {/* 추후 삭제 */}
              <div className="text-sm text-gray-500">
                상태: {EndingState[endingData.endingState]}
              </div>

              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ease-[steps(1,end)] pointer-events-none ${getOverlayClass()}`}
              />
            </>
          )}
          <Navigation selectedMenu="ending" />
        </div>
      </div>
    </>
  );
};

export default EndingPage;
