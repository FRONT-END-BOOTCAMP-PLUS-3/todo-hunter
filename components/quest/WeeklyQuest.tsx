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
    const [user, setUser] = useState<{ characterId: number } | null>(null);
  const router = useRouter();

// 로그인된 유저 정보 가져오기
const fetchUser = async () => {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("유저 정보를 불러오지 못했습니다.");

    const data = await response.json();
    setUser(data);
  } catch (err) {
    console.error(err);
    setError("유저 정보를 불러오는 중 오류 발생");
  }
};

useEffect(() => {
  fetchUser(); // 로그인한 유저 정보 가져오기
}, []);


  // API에서 주간 퀘스트 가져오는 함수
  const fetchQuests = async () => {
    try {
      const response = await fetch("/api/quest", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("퀘스트 데이터를 불러오지 못했습니다.");

      const data: Quest[] = await response.json();

      // 완료되지 않은 퀘스트가 위로, 완료된 퀘스트가 아래로 정렬
      const sortedQuests = [...data.filter((q) => q.isWeekly)].sort(
        (a, b) => Number(a.completed) - Number(b.completed)
      );
      setQuests(sortedQuests);
    } catch (err) {
      setError("퀘스트를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  // 체크 시 완료된 퀘스트를 리스트 하단으로 이동
  const handleCompleteQuest = async (questId: number) => {
    if (!user) return alert("로그인이 필요합니다.");
  
    try {
      const response = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.characterId, questId }),
      });
  
      if (!response.ok) throw new Error("퀘스트 완료 실패");
  
      // 완료된 퀘스트를 다시 불러오기 (DB에서 반영된 값 가져오기)
      fetchQuests();
    } catch (err) {
      console.error(err);
      alert("퀘스트 완료 중 오류가 발생했습니다.");
    }
  };

  // 퀘스트 삭제 함수 (DailyQuest와 동일한 로직)
  const handleDeleteQuest = async (id: number) => {
    try {
      const response = await fetch(`/api/quest/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "삭제 실패");
      }

      // 삭제된 퀘스트 리스트에서 제거
      setQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "퀘스트 삭제 중 오류가 발생했습니다.");
    }
  };

  // 퀘스트 생성 페이지 이동
  const handleAddQuest = () => {
    router.push("quest/add-quest");
  };

  // expiredAt을 YYYY-MM-DD 형식으로 변환
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="pt-1">
      <h2 className="p-3 w-fit bg-black text-white text-center font-bold">
        주간 퀘스트 ({quests.filter((q) => q.completed).length}/
        {quests.length})
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="max-h-[160px] overflow-y-auto space-y-2 pt-2">
  {quests.map(({ id, name, tagged, completed, expiredAt }) => (
    <div
      key={id}
      className={`flex justify-between items-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] shadow-black p-2  
      ${completed ? "opacity-50 line-through bg-gray-100" : "bg-white"}`}
    >
      {/* 왼쪽: 체크박스 & 이름 */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-5 h-5 border-2 border-black"
            checked={completed}
            onChange={() => handleCompleteQuest(id)}
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
        <button onClick={() => handleDeleteQuest(id)}>
          <OctagonX className="w-10 h-10 text-red-500 hover:text-red-700 transition" />
        </button>
      </div>
    </div>
  ))}
</div>
      )}
      <div className="flex justify-center">
        <Button size="L" className="mt-2" onClick={handleAddQuest}>
          ⚡ 할 일 추가
        </Button>
      </div>
    </div>
  );
};

export default WeeklyQuest;
