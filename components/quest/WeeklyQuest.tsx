"use client";

import React, { useState, useEffect } from "react";
import { Tag, type StatusVariant } from "@/components/common/Tag";
import { Button } from "@/components/common/Button";
import OctagonX from "@/components/common/OctagonX";
import { useRouter } from "next/navigation";

interface Quest {
  id: number;
  name: string;
  isWeekly: boolean;
  tagged: "STR" | "INT" | "EMO" | "FIN" | "LIV";
  expiredAt?: string;
  completed: boolean;
}

const WeeklyQuest = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // API에서 주간 퀘스트 가져오는 함수
  const fetchQuests = async () => {
    try {
      const response = await fetch("/api/quest", {
        method: "GET",
        credentials: "include", // 쿠키 포함 (필요한 경우)
      });

      if (!response.ok) throw new Error("퀘스트 데이터를 불러오지 못했습니다.");

      const data: Quest[] = await response.json();

      // 주간 퀘스트만 필터링
      const weeklyQuests = data.filter((quest) => quest.isWeekly);
      setQuests(weeklyQuests);
    } catch (err) {
      setError("퀘스트를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  // 퀘스트 삭제 함수
  const handleDeleteQuest = async (id: number) => {
    try {
      const response = await fetch(`/api/quest/${id}`, {
        method: "DELETE",
        credentials: "include", // 쿠키 포함
      });

      if (!response.ok) throw new Error("삭제 실패");

      setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== id));
    } catch (err) {
      console.error(err);
      alert("퀘스트 삭제 중 오류가 발생했습니다.");
    }
  };

  // 퀘스트 생성 페이지 이동
  const handleAddQuest = () => {
    router.push("quest/add-quest");
  };

  return (
    <div className="pt-3 bg-white rounded-md">
      <h2 className="p-3 bg-black text-white text-center font-bold">
        주간 퀘스트 ({quests.filter((q) => q.isWeekly && q.completed).length}/
        {quests.filter((q) => q.isWeekly).length})
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-2">
          {quests.filter((q) => q.isWeekly)
          .map(({ id, name, tagged, completed, expiredAt }) => (
            <div key={id} className="flex justify-between items-center border p-2 rounded-md">
              <div>
                <div className="flex items-center space-x-2">
                  <input 
                  type="checkbox" 
                  className="w-5 h-5"
                  checked={completed} />
                  <span>{name}</span>
                </div>
                {expiredAt && <p className="text-sm text-gray-500">{expiredAt}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Tag variant={tagged as StatusVariant}>{tagged}</Tag>
                <button onClick={() => handleDeleteQuest(id)}>
                  <OctagonX className="w-10 h-10 text-red-500 hover:text-red-700 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button size="M" className="mt-2 w-[360px]" onClick={handleAddQuest}>
        ⚡ 할 일 추가
      </Button>
    </div>
  );
};

export default WeeklyQuest;
