import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/common/Select";

// 연도, 월, 일 옵션 생성
const getYears = (startYear: number, endYear: number) =>
  Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const getDays = (year: number, month: number) =>
  Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);

const DateSelector = ({ onUpdate }: { onUpdate: (date: string) => void }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  useEffect(() => {
    // 날짜를 YYYY-MM-DD 형식으로 변환
    const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    onUpdate(formattedDate); // 부모 컴포넌트로 전달
  }, [selectedYear, selectedMonth, selectedDay, onUpdate]);

  return (
    <div className="pt-3 bg-white flex gap-3 justify-center items-center">
      {/* 연도 선택 */}
      <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
        <SelectTrigger className="w-auto h-9 text-sm">
          <SelectValue placeholder="연도 선택" />
        </SelectTrigger>
        <SelectContent>
          {getYears(currentYear, currentYear + 1).map((year) => (
            <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 월 선택 */}
      <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
        <SelectTrigger className="w-auto min-w-0 flex-1 h-9 text-sm px-2">
          <SelectValue placeholder="월 선택" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month.toString()}>{month}월</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 일 선택 */}
      <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(Number(value))}>
        <SelectTrigger className="w-auto min-w-0 flex-1 h-9 text-sm px-2">
          <SelectValue placeholder="일 선택" />
        </SelectTrigger>
        <SelectContent>
          {getDays(selectedYear, selectedMonth).map((day) => (
            <SelectItem key={day} value={day.toString()}>{day}일</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateSelector;

