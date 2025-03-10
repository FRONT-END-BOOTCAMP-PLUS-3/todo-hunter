import { CharacterDto } from '@/application/usecases/character/dtos';
import { create } from 'zustand';

interface ProgressState {
  progress: number;
  characterData: CharacterDto | null; // userData 추가
  setProgress: (progress: number) => void;
  setCharacterData: (characterData: CharacterDto) => void; // setCharacterData 추가
  fetchCharacterData: () => Promise<void>;
}

const characterStore = create<ProgressState>((set) => ({
  progress: 0,
  characterData: null, // 초기값 설정
  setProgress: (progress) => set({ progress }),
  setCharacterData: (characterData) => set({ characterData }), // setCharacterData 설정

  fetchCharacterData: async () => {
    try {
      const res = await fetch(`/api/character`, {
        headers: {
          "user-id": "1", // zustand로 관리할 예정
        },
      });
      const characterData = await res.json();

      set({ progress: characterData.progress, characterData }); // userData 설정

    } catch (error) {
      console.log("useProgressStore!!!!!", error);
    }
  },
}));

export default characterStore;