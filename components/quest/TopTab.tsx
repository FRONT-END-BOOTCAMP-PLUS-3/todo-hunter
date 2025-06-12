"use client";

import React from "react";

interface TopTabProps {
  viewWeekly: boolean;
  setViewWeekly: (val: boolean) => void;
  dailyCount: string;
  weeklyCount: string;
}

const TopTab: React.FC<TopTabProps> = ({
  viewWeekly,
  setViewWeekly,
  dailyCount,
  weeklyCount,
}) => {
  return (
    <div className="w-full bg-[#1c1c1c] flex z-50">
      <button
        onClick={() => setViewWeekly(false)}
        className={`flex-1 py-2 font-bold ${
          !viewWeekly ? "bg-red-600 text-white" : "bg-gray-600 text-white"
        }`}
      >
        일간 퀘스트 {dailyCount}
      </button>
      <button
        onClick={() => setViewWeekly(true)}
        className={`flex-1 py-2 font-bold ${
          viewWeekly ? "bg-red-600 text-white" : "bg-gray-600 text-white"
        }`}
      >
        주간 퀘스트 {weeklyCount}
      </button>
    </div>
  );
};

export default TopTab;
