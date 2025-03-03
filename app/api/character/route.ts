import { PrismaClient } from "@prisma/client";
import { ICharacterRepository } from "@/domain/repositories";
import { PriCharacterRepository } from "@/infrastructure/repositories";

export async function GET() {

    // 해당 사용자의 캐릭터 정보를 조회
    const prisma = new PrismaClient();
    const characterRepository:ICharacterRepository = new PriCharacterRepository(prisma);

    const character = await characterRepository.findById(1);
    if (!character) throw new Error("Character not found");

    return character;
}