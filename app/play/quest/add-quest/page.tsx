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
import { Input } from "@/components/common";

const AddDailyQuest = () => {
  const router = useRouter();
  const [questName, setQuestName] = useState("");
  const [tagged, setTagged] = useState<"STR" | "INT" | "EMO" | "FIN" | "LIV">("STR");
  const [user, setUser] = useState<{ characterId: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isWeekly, setIsWeekly] = useState(false); // 체크박스 상태 추가


  // 로그인한 유저의 characterId 가져오기
  useEffect(() => {
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
    fetchUser();
  }, []);

  const handleSaveQuest = async () => {
    if (!questName.trim()) {
      alert("퀘스트 이름을 입력하세요!");
      return;
    }
    if (!user?.characterId) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    console.log("저장되는 expiredAt 값:", selectedDate); // 콘솔에서 확인
  
    try {
      const response = await fetch("/api/quest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          characterId: user.characterId,
          name: questName,
          tagged,
          isWeekly,
          expiredAt: selectedDate || null, // 시간 정보 없이 YYYY-MM-DD로 전송
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
    <div className="flex-1 pt-10 justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-lg">
        <h2 className="bg-black text-white text-center font-bold p-2">
          어떤 일을 하나요?
        </h2>

        {/* 스탯 목록 카테고리 */}
        <div className="pt-5 pb-5 flex gap-5 justify-center items-center">
          <Select onValueChange={(value) => setTagged(value as any)}>
            <SelectTrigger className="w-32 h-11 text-sm px-2">
              <SelectValue placeholder="스탯 목록"/>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="퀘스트를 입력하세요"
            value={questName}
            onChange={(e) => setQuestName(e.target.value)}
            state={questName ? "current" : "default"}
            className="w-auto h-9 text-sm"
          />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="pt-10 pb-10">
          <h2 className="bg-black text-white text-center font-bold p-2">
            언제까지 하나요?
          </h2>
          <DateSelector onUpdate={setSelectedDate} />
        </div>

        <div className="flex gap-3 bg-white items-center">
          <h2 className="p-3 bg-black text-white text-center font-bold">반복 여부</h2>
          <input
          type="checkbox"
          className="w-5 h-5"
          checked={isWeekly} // 상태 반영
          onChange={(e) => setIsWeekly(e.target.checked)} // 체크 여부 업데이트
        />
        </div>

        <div className="flex p-6 gap-4 justify-center items-center">
          <Button size="S" state="success" onClick={handleSaveQuest}>
            할일 추가
          </Button>
          <Button size="S" onClick={() => router.push("/play/quest")}>
            할일 취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddDailyQuest;
