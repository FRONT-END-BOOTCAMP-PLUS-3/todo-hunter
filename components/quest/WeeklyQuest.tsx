"use client";

import React, { useEffect } from "react";
import { useQuestStore } from "@/utils/stores/questStore";
import { Tag } from "@/components/common/Tag";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";

const WeeklyQuest = () => {
  const { quests, fetchQuests, completeQuest, deleteQuest, loading, error } = useQuestStore();
  const router = useRouter();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const onAddQuestHandler = () => {
    router.push("quest/add-quest");
  };

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="pt-0">
      <h2 className="p-3 w-fit bg-black text-white font-bold">
        주간 퀘스트 ({quests.filter((q) => q.isWeekly && q.completed).length}/
        {quests.filter((q) => q.isWeekly).length})
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="max-h-[300px] overflow-y-auto space-y-2 pt-2">
          {quests
            .filter((q) => q.isWeekly) // 주간 퀘스트만 필터링
            .map(({ id, name, tagged, completed, expiredAt }) => (
              <div
                key={id}
                className={`flex justify-between items-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] shadow-black p-2  
                ${completed ? "opacity-50 bg-gray-100" : "bg-white"}`}
              >
                {/* 왼쪽: 체크박스 & 이름 */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 border-2 border-black"
                      checked={completed}
                      disabled={completed} // 완료된 항목은 체크 불가능
                      onChange={() => {
                        if (!completed) {
                          completeQuest(id);
                        }
                      }}
                    />
                    <span className="text-lg">{name}</span>
                  </div>

                  {/* 만료 날짜 표시 */}
                  {expiredAt && (
                    <p className="text-sm text-gray-500">{formatDate(expiredAt)}</p>
                  )}
                </div>

                {/* 오른쪽: 태그 & 삭제 버튼 */}
                <div className="flex items-center space-x-2">
                  <Tag variant={tagged}>{tagged}</Tag>
                  <button onClick={() => deleteQuest(id)}>
                  <div className="pt-1">
                  <i className="hn hn-octagon-times-solid text-[35px] text-red-500"></i>  
                  </div>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className="flex justify-center">
        <Button size="L" className="mt-2" onClick={onAddQuestHandler}>
          ⚡ 할 일 추가
        </Button>
      </div>
    </div>
  );
};

export default WeeklyQuest;
