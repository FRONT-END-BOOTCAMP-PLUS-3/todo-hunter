import { create } from "zustand";

interface UserStore {
  id: number | null;
  loginId: string | null;
  nickname?: string;
  progress?: string;
  str?: number;
  int?: number;
  emo?: number;
  fin?: number;
  liv?: number;
  setId: (id: number) => void;
  setLoginId: (loginId: string) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  fetchCharacter: () => Promise<void>;
}

// 스토어 생성 및 초기화
export const useUserStore = create<UserStore>((set, get) => {
  const store = {
    id: null,
    loginId: null,
    nickname: undefined,
    progress: undefined,
    str: undefined,
    int: undefined,
    emo: undefined,
    fin: undefined,
    liv: undefined,
    setId: (id: number) => set({ id }),
    setLoginId: (loginId: string) => set({ loginId }),
    clearUser: () =>
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
      }),
    fetchUser: async () => {
      try {
        // Access Token 읽어오는 API (HttpOnly 쿠키이기 때문에 API로 읽어와야 함)
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) throw new Error("API 호출 실패");
        const data = await res.json();

        set({ id: data.user?.id, loginId: data.user?.loginId });
        
        // fetchUser 내부 호출
        if (data.user?.id) {
          await get().fetchCharacter(); // 캐릭터 정보를 fetchUser 내부에서 호출
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    },
    fetchCharacter: async () => {
      try {
        const userId = get().id;
        if (!userId) throw new Error("사용자 id가 존재하지 않습니다.");
        const res = await fetch("/api/character", {
          headers: {
            "user-id": userId.toString(),
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
        });
      } catch (error) {
        console.error("캐릭터 데이터를 가져오는 중 오류 발생:", error);
      }
    },
  };

  // 클라이언트 사이드일 때만 자동으로 fetchUser() 실행
  if (typeof window !== "undefined") {
    store.fetchUser();
  }

  return store;
});
