import { create } from "zustand";

interface Quest {
  id: number;
  name: string;
  isWeekly: boolean;
  tagged: "STR" | "INT" | "EMO" | "FIN" | "LIV";
  expiredAt?: string | null;
  completed: boolean;
  characterId: number;
}

interface QuestStore {
  quests: Quest[];
  loading: boolean;
  error: string | null;
  fetchQuests: () => Promise<void>;
  completeQuest: (questId: number) => Promise<void>;
  deleteQuest: (questId: number) => Promise<void>;
  addQuest: (quest: Omit<Quest, "id">) => Promise<void>;
}

export const useQuestStore = create<QuestStore>((set) => ({
  quests: [],
  loading: false,
  error: null,

  fetchQuests: async () => {
    set({ loading: true, error: null });
  
    try {
      const response = await fetch("/api/quest");
      if (!response.ok) throw new Error("퀘스트 데이터를 불러오지 못했습니다.");
  
      const json = await response.json();
      
      if (!json.success || !Array.isArray(json.quests)) { // 응답 구조 확인
        throw new Error("퀘스트 데이터를 올바르게 받아오지 못했습니다.");
      }
  
      const sortedQuests = [...json.quests].sort((a, b) => Number(a.completed) - Number(b.completed));
  
      set({ quests: sortedQuests, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "알 수 없는 오류 발생", loading: false });
    }
  },
  

  completeQuest: async (questId) => {
    try {
      const user = { characterId: 1 }; // 실제 로그인한 유저 정보로 교체 필요
  
      const response = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.characterId, questId }), // characterId 추가
      });
  
      if (!response.ok) throw new Error("퀘스트 완료 실패");
  
      set((state) => ({
        quests: state.quests.map((q) =>
          q.id === questId ? { ...q, completed: true } : q
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteQuest: async (questId) => {
    try {
      const response = await fetch(`/api/quest/${questId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("삭제 실패");

      set((state) => ({
        quests: state.quests.filter((q) => q.id !== questId),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  addQuest: async (quest: Omit<Quest, "id"> & { characterId: number }) => { 
    try {
      const response = await fetch("/api/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quest),
      });
  
      if (!response.ok) throw new Error("퀘스트 추가 실패");
  
      await useQuestStore.getState().fetchQuests();
    } catch (err) {
      console.error(err);
    }
  },
}));
