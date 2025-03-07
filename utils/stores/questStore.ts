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

  completeQuest: async (questId) => {
    try {
      const user = { characterId: 1 }; // 로그인한 유저 정보
  
      set({ isMoving: true, isMovingForward: true });
  
      const performAction = (step: number) => {
        switch (step) {
          case 1: // 몬스터 앞으로 이동 시작
            set({ isMoving: true, isMovingForward: true });
            setTimeout(() => performAction(2), 600); // 0.6초 후 공격 시작
            break;
          case 2: // 이동 완료 후 공격 시작
            set({ isMoving: false, isAttacking: true });
            setTimeout(() => performAction(3), 800); // 0.8초 후 멈춤 상태 유지
            break;
          case 3: // 공격 종료 후 잠깐 멈춤 (뒤로 이동 X)
            set({ isAttacking: false, isMoving: false, isMovingForward: false }); 
            setTimeout(() => performAction(4), 400); // 0.4초 동안 멈춘 후 이동 시작
            break;
          case 4: // 멈춘 후 뒤로 이동 시작
            set({ isMoving: true, isMovingForward: false });
            setTimeout(() => performAction(5), 600); // 0.6초 후 복귀 완료
            break;
          case 5: // 복귀 완료 후 종료
            set((state) => ({
              quests: state.quests.map((q) =>
                q.id === questId ? { ...q, completed: true } : q
              ),
              isMoving: false,
              isMovingForward: true, // 다음 공격을 위해 초기화
            }));
            break;
        }
      };
  
      // 첫 번째 단계 실행 (이동 시작)
      performAction(1);
  
      // API 요청
      const response = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.characterId, questId }),
      });
  
      if (!response.ok) throw new Error("퀘스트 완료 실패");
    } catch (err) {
      console.error(err);
      set({ isMoving: false, isAttacking: false, isMovingForward: true }); // 에러 발생 시 초기화
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
