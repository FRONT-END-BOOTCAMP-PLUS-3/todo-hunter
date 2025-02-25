import { Quest } from "@prisma/client";

export interface QuestRepository {
    findById(id: number): Promise<Quest | null>;
    findAll(): Promise<Quest[]>;
    create(quest: Quest): Promise<Quest>;
    update(id: number, quest: Partial<Quest>): Promise<Quest>;
    // delete(id: number): Promise<void>;
    }