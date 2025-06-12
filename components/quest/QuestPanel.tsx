"use client";

import React, { useState, useEffect } from "react";
import { useQuestStore } from "@/utils/stores/questStore";
import { Tag } from "@/components/common/Tag";
import { useRouter } from "next/navigation";

const QuestPanel = () => {
  const {
    quests,
    fetchQuests,
    completeQuest,
    deleteQuest,
    loading,
    error,
  } = useQuestStore();
  const [viewWeekly, setViewWeekly] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const onAddQuestHandler = () => {
    router.push("quest/add-quest");
  };

  const filteredQuests = quests.filter((q) => q.isWeekly === viewWeekly);
  const completedCount = filteredQuests.filter((q) => q.completed).length;

  return (
    <div className="w-full flex flex-col p-3 bg-[#1c1c1c]">
      {/* 상단 탭 */}
      <div className="flex overflow-hidden mb-2">
        <button
          className={`flex-1 py-2 font-bold ${
            !viewWeekly
              ? "bg-red-600 text-white"
              : "bg-gray-600 text-white"
          }`}
          onClick={() => setViewWeekly(false)}
        >
          일간 퀘스트 ({quests.filter((q) => !q.isWeekly && q.completed).length}/
          {quests.filter((q) => !q.isWeekly).length})
        </button>
        <button
          className={`flex-1 py-2 font-bold ${
            viewWeekly
              ? "bg-red-600 text-white"
              : "bg-gray-600 text-white"
          }`}
          onClick={() => setViewWeekly(true)}
        >
          <span className="mr-1"></span> 주간 퀘스트 ({quests.filter((q) => q.isWeekly && q.completed).length}/
          {quests.filter((q) => q.isWeekly).length})
        </button>
      </div>

      {/* 퀘스트 목록 */}
      {loading ? (
        <p className="text-center text-gray-400">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-y-auto space-y-2">
          {filteredQuests.map(({ id, name, tagged, completed }) => (
            <div
              key={id}
              className={`flex justify-between items-center border-2 border-black rounded-full px-4 py-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                completed ? "opacity-50 bg-gray-100" : "bg-white"
              }`}
            >
              {/* 왼쪽 체크박스 + 퀘스트 이름 */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center cursor-pointer ${
                    completed ? "bg-red-500" : "bg-white"
                  }`}
                  onClick={() => {
                    if (!completed) completeQuest(id);
                  }}
                >
                  {completed && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-sm font-bold">{name}</span>
              </div>

              {/* 태그 + 삭제 버튼 */}
              <div className="flex items-center space-x-2">
                <Tag variant={tagged}>{tagged}</Tag>
                <button onClick={() => deleteQuest(id)}>
                  <i className="hn hn-octagon-times-solid text-[24px] text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 할 일 추가 버튼 */}
      <div className="fixed bottom-20 right-5 z-50">
  <button
    onClick={onAddQuestHandler}
    className="w-[70px] h-[70px] bg-red-600 bg-[url('/svgs/btn-octagon.svg')] bg-cover text-white text-[14px] font-bold leading-tight"
  >
    할일추가
  </button>
</div>
    </div>
  );
};

export default QuestPanel;
