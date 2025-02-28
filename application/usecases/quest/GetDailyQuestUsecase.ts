import { IQuestRepository } from "@/domain/repositories";
import { ResponseQuestDTO } from "./dtos";
import { STATUS } from "@/constants";

export class ViewQuestUsecase {
    constructor(
        private readonly PrIQuestRepository: IQuestRepository,
    ) {}

    async getQuestList(characterId: number): Promise<ResponseQuestDTO[]> {
        const quests = await this.PrIQuestRepository.findCurrentQuests(characterId, new Date());
        if (!quests) throw new Error("characterNickname not found");

        return quests.map(quest => ({
            characterId: quest.characterId,
            name: quest.name,
            tagged: quest.tagged as keyof typeof STATUS,
            isWeekly: quest.isWeekly,
            expiredAt: quest.expiredAt ?? undefined,
            createdAt: quest.createdAt,
        }));
    }
}