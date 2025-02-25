import { Character } from "@prisma/client";

export interface CharacterRepository {
    findById: (id: number) => Promise<Character | null>;
    findByUserId: (userId: number) => Promise<Character | null>;
    addEndingCount: (id: number) => Promise<number>; 
    create: (userId: number) => Promise<Character>;
    isCheckEnding: (id: number) => Promise<boolean | null>;
}