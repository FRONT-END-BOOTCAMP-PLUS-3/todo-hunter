import { create } from "zustand";

export interface Title {
    name: string;
    titleId: string;
    img: string; // Added 'img' property
}

interface TitleStore {
    titles: Array<Title>;
    page: number;
    setTitles: (titles: Array<Title>) => void;
    setPage: (page: number) => void;
}

export const useTitleStore = create<TitleStore>((set) => ({
    titles: [],
    page: 1,
    setTitles: (titles) => set({ titles }),
    setPage: (page) => set({ page }),
}));
