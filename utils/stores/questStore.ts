import { STATUS } from "@/constants";
import { toast } from "sonner";
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
  isMoving: boolean; // 이동 애니메이션 상태
  isMovingForward: boolean;
  isAttacking: boolean; // 공격 애니메이션 상태
  isDefeated: boolean; // werewolf 처치 여부 추가
  setDefeated: (value: boolean) => void;
  fetchQuests: () => Promise<void>;
  completeQuest: (questId: number) => Promise<void>;
  deleteQuest: (questId: number) => Promise<void>;
  addQuest: (quest: Omit<Quest, "id">) => Promise<void>;
}

export const useQuestStore = create<QuestStore>((set) => ({
  quests: [],
  loading: false,
  error: null,
  isMoving: false,
  isMovingForward: false,
  isAttacking: false, // 초기값 : false
  isDefeated: false, // 초기값은 false
  setDefeated: (value) => set({ isDefeated: value }),

  fetchQuests: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/quest");
      if (!response.ok) throw new Error("퀘스트 데이터를 불러오지 못했습니다.");

      const json = await response.json();

      if (!json.success || !Array.isArray(json.quests)) {
        throw new Error("퀘스트 데이터를 올바르게 받아오지 못했습니다.");
      }

      const sortedQuests = [...json.quests].sort(
        (a, b) => Number(a.completed) - Number(b.completed)
      );

      set({ quests: sortedQuests, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "알 수 없는 오류 발생",
        loading: false,
      });
    }
  },
  // API요청, quests 상태,
  // 애니메이션과 관련된 상태 (isMoving, isAttacking) completeQuest()가 실행될 때 상태를 변경
  completeQuest: async (questId) => {
    try {
      const user = { characterId: 1 }; // 임시 유저 정보
  
      // 1. 해당 퀘스트 찾기
      const quest = useQuestStore.getState().quests.find((q) => q.id === questId);
      if (!quest) return;
  
      // 2. 낙관적 UI 업데이트 (즉시 반영)
      set((state) => ({
        quests: state.quests.map((q) =>
          q.id === questId ? { ...q, completed: true } : q
        ),
      }));
  
      // 3. 애니메이션 실행
      set({ isMoving: true, isMovingForward: true });
  
      setTimeout(() => {
        set({ isMoving: false, isAttacking: true });
  
        setTimeout(() => {
          set({ isAttacking: false, isMoving: true, isMovingForward: false });
  
          setTimeout(() => {
            set({ isMoving: false, isMovingForward: true });
          }, 600);
        }, 1000);
      }, 600);
  
      // 4. API 요청
      const response = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.characterId, questId }),
      });
  
      if (!response.ok) throw new Error("퀘스트 완료 실패");
  
      // 5. 완료 후 상태 메시지 띄우기
      toast.success(` ${STATUS[quest.tagged]} 스탯이 +1 증가했습니다!`);
    } catch (err) {
      console.error(err);
  
      // 실패 시 애니메이션 중단 & 상태 롤백
      set({ isMoving: false, isAttacking: false, isMovingForward: true });
  
      set((state) => ({
        quests: state.quests.map((q) =>
          q.id === questId ? { ...q, completed: false } : q
        ),
      }));
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
