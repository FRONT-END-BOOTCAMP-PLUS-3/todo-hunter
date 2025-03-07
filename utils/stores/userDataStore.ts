import { CharacterDto } from '@/application/usecases/character/dtos';
import { create } from 'zustand';

interface ProgressState {
  progress: number;
  userData: CharacterDto | null; // userData 추가
  setProgress: (progress: number) => void;
  setUserData: (userData: CharacterDto) => void; // setUserData 추가
  fetchUserData: () => Promise<void>;
}

const useProgressStore = create<ProgressState>((set) => ({
  progress: 0,
  userData: null, // 초기값 설정
  setProgress: (progress) => set({ progress }),
  setUserData: (userData) => set({ userData }), // setUserData 설정

  fetchUserData: async () => {
    try {
      const res = await fetch(`/api/character`, {
        headers: {
          "user-id": "1", // zustand로 관리할 예정
        },
      });
      const userData = await res.json();

      set({ progress: userData.progress, userData }); // userData 설정

    } catch (error) {
      console.log("useProgressStore!!!!!", error);
    }
  },
}));

export default useProgressStore;