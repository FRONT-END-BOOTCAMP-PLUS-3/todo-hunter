"use client";

import DailyQuest from "@/components/quest/DailyQuest";
import FightField from "@/components/quest/FightField";
import WeeklyQuest from "@/components/quest/WeeklyQuest";


const QuestPage = () => {
  
  return (
    <div className="mt-3 min-vh">
      {/* 경험치 진행 UI */}
      <div className="mb-3 w-full bg-black text-white text-center font-bold">
        경험치 쌓는 중...      
      </div>
        <FightField />

      <DailyQuest />
      <WeeklyQuest />
      
    </div>
  );
};

export default QuestPage;
