"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/common/Select";
import { STATUS } from "@/constants/status";
import DateSelector from "@/components/common/DateSelcetor";

const AddDailyQuest = () => {
  const router = useRouter();
  const [questName, setQuestName] = useState("");
  const [tagged, setTagged] = useState<"STR" | "INT" | "EMO" | "FIN" | "LIV">("STR");
  const [characterId, setCharacterId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  // 로그인한 유저의 characterId 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });

        if (!response.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");

        const userData = await response.json();
        setCharacterId(userData.characterId);
      } catch (err) {
        console.error(err);
        setError("로그인이 필요합니다.");
      }
    };

    fetchUserData();
  }, []);

  const handleSaveQuest = async () => {
    if (!questName.trim()) {
      alert("퀘스트 이름을 입력하세요!");
      return;
    }
    if (!characterId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("/api/quest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          characterId,
          name: questName,
          tagged,
          isWeekly: false,
          expiredAt: null,
        }),
      });

      if (!response.ok) {
        throw new Error("퀘스트 추가 실패");
      }

      router.push("/play/quest");
    } catch (err) {
      console.error(err);
      setError("퀘스트 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md">
      <h2 className="m-4 p-4 bg-black text-white text-center font-bold rounded-md">
        어떤 일을 하나요?
      </h2>

      {/* 스탯 목록 카테고리 */}
      <div className="w-22 mb-4">
        <Select value={tagged} onValueChange={(value) => setTagged(value as "STR" | "INT" | "EMO" | "FIN" | "LIV")}>
          <SelectTrigger className=" p-2 border rounded-md">
            <SelectValue placeholder="스탯 목록" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STR">{STATUS.STR}</SelectItem>
            <SelectItem value="INT">{STATUS.INT}</SelectItem>
            <SelectItem value="EMO">{STATUS.EMO}</SelectItem>
            <SelectItem value="FIN">{STATUS.FIN}</SelectItem>
            <SelectItem value="LIV">{STATUS.LIV}</SelectItem>
          </SelectContent>
        </Select>
        <input
        type="text"
        placeholder="퀘스트 이름 입력"
        value={questName}
        onChange={(e) => setQuestName(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      />
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}


      <div className="p-4 bg-white shadow-md">
      <h2 className="m-4 p-4 bg-black text-white text-center font-bold rounded-md">
       언제까지 하나요?</h2>
       <DateSelector onUpdate={(date) => setSelectedDate(date)} />
      </div>

      <div className="flex bg-white shadow-md">
      <h2 className="m-4 p-4 bg-black text-white text-center font-bold rounded-md">
       반복 여부</h2>
       <input type="checkbox" className="w-5 h-5" />
      </div>

      <div className="flex gap-4 items-center">
      <Button size="S" onClick={handleSaveQuest}>
        할일 추가
      </Button>
      <Button size="S" onClick={() => router.push("/play/quest")}>
        할일 취소
      </Button>
    </div>
    </div>
  );
};

export default AddDailyQuest;
