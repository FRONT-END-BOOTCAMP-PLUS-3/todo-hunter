import {  IQuestRepository, ISuccessDayRepository } from "@/domain/repositories";
import { GetQuestDTO } from "./dtos";
import { STATUS } from "@/constants";

export class WeeklyQuestUsecase{
    constructor(
        private readonly questRepository: IQuestRepository, 
        private readonly successDayRepository: ISuccessDayRepository, 
    ) {}

    async getWeeklyQuestList(characterId: number): Promise<GetQuestDTO[]> {
        let weeklyQuests = await this.questRepository.findWeeklyQuests(characterId, new Date());
        if (!weeklyQuests) throw new Error("characterNickname not found");
        
        const successDay = await this.successDayRepository.findByQuestId(characterId);
        successDay.map((success) => {
            weeklyQuests = weeklyQuests.filter((quest) => quest.id !== success.questId);
        })
        return weeklyQuests.map(quest => ({
            characterId: quest.characterId,
            name: quest.name,
            tagged: quest.tagged as keyof typeof STATUS,
            isWeekly: quest.isWeekly,
            expiredAt: quest.expiredAt ?? undefined,
            createdAt: quest.createdAt,
        }));
    }
}