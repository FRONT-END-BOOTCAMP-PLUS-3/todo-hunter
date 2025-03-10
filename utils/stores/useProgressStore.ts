import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
    progress: number;
    setProgress: (progress: number) => void;
}
const useProgressStore = create<ProgressState>()(
    persist(
      (set) => ({
        progress: 0,
        setProgress: (progress) => set({ progress }),
      }),
      {
        name: 'progress-storage', // localStorage에 저장될 키 이름
      }
    )
  );

export default useProgressStore;