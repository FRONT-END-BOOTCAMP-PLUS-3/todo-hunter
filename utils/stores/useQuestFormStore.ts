import { create } from "zustand";

interface QuestFormState {
  questName: string;
  tagged: "STR" | "INT" | "EMO" | "FIN" | "LIV";
  selectedDate: string;
  isWeekly: boolean;
  setQuestName: (name: string) => void;
  setTagged: (tag: "STR" | "INT" | "EMO" | "FIN" | "LIV") => void;
  setSelectedDate: (date: string) => void;
  setIsWeekly: (isWeekly: boolean) => void;
  resetForm: () => void; // 추가: 폼 초기화 함수
}

export const useQuestFormStore = create<QuestFormState>((set) => ({
  questName: "",
  tagged: "STR",
  selectedDate: "",
  isWeekly: false,

  setQuestName: (name) => set({ questName: name }),
  setTagged: (tag) => set({ tagged: tag }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setIsWeekly: (isWeekly) => set({ isWeekly }),

  resetForm: () => set({ questName: "", tagged: "STR", selectedDate: "", isWeekly: false }),
}));
