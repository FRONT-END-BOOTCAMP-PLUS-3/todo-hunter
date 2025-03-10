import { prisma } from "@/lib/prisma";
import { ICharacterRepository, IQuestRepository, IStatusRepository, ISuccessDayRepository, IUserRepository } from "@/domain/repositories";
import { PriCharacterRepository, PriQuestRepository, PriStatusRepository, PriSuccessDayRepository, PriUserRepository } from "@/infrastructure/repositories";
import { NextRequest, NextResponse } from "next/server";
import { CharacterUsecase } from "@/application/usecases/character/CharacterUsecase";
import { CharacterDto } from "@/application/usecases/character/dtos";


export async function GET(req: NextRequest) {
    const userIdHeader = Number(req.headers.get("user-id"));
    
    const characterRepository: ICharacterRepository = new PriCharacterRepository(prisma);
    const statusRepository:IStatusRepository= new PriStatusRepository(prisma);
    const userRepository:IUserRepository = new PriUserRepository(prisma);
    const questRepository:IQuestRepository = new PriQuestRepository(prisma);
    const successDayRepository: ISuccessDayRepository = new PriSuccessDayRepository(prisma);
    
    const character = await characterRepository.findByUserId(userIdHeader);
    const characterId = Number(character?.id);

    const characterUsecase = new CharacterUsecase(
        statusRepository,
        userRepository,
        characterRepository,
        questRepository,
        successDayRepository
    );

    const characterDto:CharacterDto = await characterUsecase.getStatusAndNickname(characterId, userIdHeader);

    return NextResponse.json(characterDto);
}