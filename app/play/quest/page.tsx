"use client";

import React from "react";
import DailyQuest from "@/components/quest/DailyQuest";
import WeeklyQuest from "@/components/quest/WeeklyQuest";
import FightField from "@/components/quest/FightField";

const QuestPage = () => {

  return (
    <div className="flex-1 mt-3 min-vh overflow-x-hidden">
      {/* 경험치 진행 UI */}
      <div className="fixed left-0 right-0">
        <div className="mb-3 w-full bg-black text-white text-center font-bold">
          경험치 쌓는 중...
        </div>

        <FightField />
      </div>

      {/* 퀘스트 영역 */}
      <div className="flex flex-col p-3 fixed left-0 right-0 top-[198px] bottom-[80px] overflow-y-scroll">
          <div className="mt-2"></div>
          <DailyQuest />
          <div className="mt-6"></div>
          <WeeklyQuest />
          <br />
      </div>
    </div>
  );
};

export default QuestPage;