"use client";

import React from "react";
import DailyQuest from "@/components/quest/DailyQuest";
import WeeklyQuest from "@/components/quest/WeeklyQuest";
import FightField from "@/components/quest/FightField";
import { useQuestStore } from "@/utils/stores/questStore";

const QuestPage = () => {
  const { quests, isAttacking } = useQuestStore(); // Zustand에서 isAttacking 바로 사용

  return (
    <div className="flex-1 mt-3 min-vh">
      {/* 경험치 진행 UI */}
      <div className="mb-3 w-full bg-black text-white text-center font-bold">
        경험치 쌓는 중...
      </div>

      <FightField />

      {/* 퀘스트 영역 */}
      <div className="flex flex-col gap-3">
        <DailyQuest />
        <WeeklyQuest />
      </div>
    </div>
  );
};

export default QuestPage;
