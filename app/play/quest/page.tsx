"use client";

import React from "react";
import DailyQuest from "@/components/quest/DailyQuest";
import WeeklyQuest from "@/components/quest/WeeklyQuest";
import FightField from "@/components/quest/FightField";
import QuestPanel from "@/components/quest/QuestPanel";

const QuestPage = () => {

  return (
    <div className="flex-1 mt-3 min-vh overflow-x-hidden">
      {/* 경험치 진행 UI */}
      <div className="fixed left-0 right-0">
        <FightField />
      </div>``

      {/* 퀘스트 영역 */}
      <div className="flex flex-col fixed left-0 right-0 top-[198px] bottom-[80px] overflow-y-scroll">
        <QuestPanel />
          {/* <div className="mt-2"></div>
          <DailyQuest />
          <div className="mt-6"></div>
          <WeeklyQuest />
          <br /> */}
      </div>
    </div>
  );
};

export default QuestPage;