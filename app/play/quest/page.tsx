"use client";

import React, { useEffect, useState } from "react";
import DailyQuest from "@/components/quest/DailyQuest";
import WeeklyQuest from "@/components/quest/WeeklyQuest";
import FightField from "@/components/quest/FightField";
import { useQuestStore } from "@/utils/stores/questStore";

const QuestPage = () => {
  const quests = useQuestStore((state) => state.quests);
  const [isAttacking, setIsAttacking] = useState(false);

  // 미구현 : 퀘스트 완료 useEffect 반응해야하는데
  // 지금은 퀘스트가 추가되면 3초간 공격 상태로 변경
  useEffect(() => {
    if (quests.length > 0) {
      
      setIsAttacking(true);
      const timer = setTimeout(() => setIsAttacking(false), 3000);
      return () => clearTimeout(timer);

    }
  }, [quests.length]);

  return (
    <div className="flex-1 mt-3 min-vh">
      {/* 경험치 진행 UI */}
      <div className="mb-3 w-full bg-black text-white text-center font-bold">
        경험치 쌓는 중...
      </div>

      <FightField isAttacking={isAttacking}/>

      {/* 퀘스트 영역 */}
      <div className="flex flex-col gap-3">
        <DailyQuest />
        <WeeklyQuest />
      </div>
    </div>
  );
};

export default QuestPage;