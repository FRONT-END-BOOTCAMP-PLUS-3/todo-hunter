"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuestStore } from "@/utils/stores/questStore";
import { useQuestFormStore } from "@/utils/stores/useQuestFormStore";
import { Button } from "@/components/common/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/common/Select";
import { STATUS } from "@/constants/status";
import DateSelector from "@/components/common/DateSelector";
import { Input } from "@/components/common";

const AddDailyQuest = () => {
  const router = useRouter();
  const { addQuest } = useQuestStore();
  const {
    questName,
    tagged,
    selectedDate,
    isWeekly,
    setQuestName,
    setTagged,
    setSelectedDate,
    setIsWeekly,
    resetForm,
  } = useQuestFormStore();

  const onSaveQuestHandler = async () => {
    if (!questName.trim()) {
      alert("퀘스트 이름을 입력하세요!");
      return;
    }

    const user = { characterId: 1 }; // 추후 실제 로그인된 유저 정보로 대체

    if (!user?.characterId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await addQuest({
        characterId: user.characterId, 
        name: questName,
        tagged,
        isWeekly,
        expiredAt: selectedDate || null,
        completed: false,
      });

      resetForm(); // 폼 초기화
      router.push("/play/quest");
    } catch (err) {
      console.error("퀘스트 추가 중 오류 발생", err);
    }
  };

  return (
    <div className="flex-1 pt-10 justify-center items-center">
      <div className="ml-3 mr-3 bg-white rounded-lg">
        <div>
        <h2 className="bg-black text-white text-center font-bold p-2">
          어떤 일을 하나요?
        </h2>

        <div className="pt-5 pb-5 flex gap-5 justify-center items-center">
          <Select onValueChange={(value: keyof typeof STATUS) => setTagged(value)}>
            <SelectTrigger className="w-[120px] h-11 text-sm px-2 max-[360px]:w-[30%]">
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
            className="flex-grow h-9 text-sm mr-[6px] max-[360px]:w-[70%]"
          />
        </div>
        </div>

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
            checked={isWeekly}
            onChange={(e) => setIsWeekly(e.target.checked)}
          />
        </div>

        <div className="flex p-6 gap-4 justify-center items-center">
          <Button size="S" state="success" onClick={onSaveQuestHandler}>
            할일 추가
          </Button>
          <Button size="S" onClick={() => {
            resetForm(); // 폼 초기화
            router.push("/play/quest");
          }}>
            할일 취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddDailyQuest;
