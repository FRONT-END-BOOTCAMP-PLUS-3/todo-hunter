import { Quest } from "@prisma/client";

export interface IQuestRepository {
    findById: (id: number) => Promise<Quest | null>;
    findByTag: (tag: string) => Promise<Quest[]>;
    findCurrentQuests: (characterId: number, currentDay: Date) => Promise<Quest[] | null>;
    findWeeklyQuests: (characterId: number) => Promise<Quest[]>;
    findBeforeEndDate: (characterId: number, endDate: Date) => Promise<Quest[]>;
    findByCreatedAt: (characterId: number)=> Promise<Quest[]>;
    create(questData: Omit<Quest, "id">): Promise<Quest>;
    update: (id: number, quest: Partial<Quest>) => Promise<Quest>;
    delete: (id: number, characterId: number) => Promise<void>;
}
