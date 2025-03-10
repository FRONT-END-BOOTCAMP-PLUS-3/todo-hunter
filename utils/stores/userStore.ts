import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  id: number | null;
  loginId: string | null;
  nickname?: string;
  progress?: number;
  str?: number;
  int?: number;
  emo?: number;
  fin?: number;
  liv?: number;
  endingCount?: number;
  endingState?: number;
  setId: (id: number) => void;
  setLoginId: (loginId: string) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  fetchCharacter: () => Promise<void>;
  fetchEndingState: () => Promise<void>;
}

// Zustand + persist 적용
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      id: null,
      loginId: null,
      nickname: undefined,
      progress: undefined,
      str: undefined,
      int: undefined,
      emo: undefined,
      fin: undefined,
      liv: undefined,
      endingCount: undefined,
      endingState: undefined,
      setId: (id: number) => set({ id }),
      setLoginId: (loginId: string) => set({ loginId }),
      clearUser: () => {
        set({
          id: null,
          loginId: null,
          nickname: undefined,
          progress: undefined,
          str: undefined,
          int: undefined,
          emo: undefined,
          fin: undefined,
          liv: undefined,
          endingCount: undefined,
          endingState: undefined,
        });
        sessionStorage.removeItem("user-session-data"); // 세션 초기화
      },
      fetchUser: async () => {
        if (get().id) return; // 이미 상태가 있으면 fetchUser 실행 안 함

        try {
          const res = await fetch("/api/auth/signin-info", { credentials: "include" });
          if (!res.ok) throw new Error("API 호출 실패");
          const data = await res.json();

          set({ id: data.user?.id, loginId: data.user?.loginId });

          if (data.user?.id) {
            await get().fetchCharacter();
            await get().fetchEndingState();
          }
        } catch (error) {
          console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        }
      },
      fetchCharacter: async () => {
        if (!get().id) throw new Error("사용자 id가 존재하지 않습니다.");
        try {
          const res = await fetch("/api/character", {
            headers: {
              "user-id": get().id!.toString(),
            },
          });
          if (!res.ok) throw new Error("캐릭터 데이터 호출 실패");
          const data = await res.json();
          set({
            nickname: data.nickname,
            progress: data.progress,
            str: data.str,
            int: data.int,
            emo: data.emo,
            fin: data.fin,
            liv: data.liv,
            endingCount: data.endingCount,
          });
        } catch (error) {
          console.error("캐릭터 데이터를 가져오는 중 오류 발생:", error);
        }
      },
      fetchEndingState: async () => {
        if (!get().id) return;

        try {
          const res = await fetch("/api/ending", {
            headers: {
              "X-User-Id": get().id!.toString(),
            },
          });
          if (!res.ok) throw new Error("엔딩 정보 요청 실패");
          const data = await res.json();
          set({ endingState: data.endingState });
        } catch (error) {
          console.error("엔딩 정보를 가져오는 중 오류 발생:", error);
        }
      },
    }),
    {
      name: "user-session-data", // 저장할 키 이름
      storage: {
        getItem: async (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          sessionStorage.removeItem(name);
        },
      }, // sessionStorage 사용 (페이지 닫히면 초기화)
    }
  )
);

// 클라이언트 사이드일 때만 fetchUser() 실행
if (typeof window !== "undefined") {
  useUserStore.getState().fetchUser();
}
