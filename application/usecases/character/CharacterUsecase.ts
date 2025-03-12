import { ICharacterRepository, IQuestRepository, IStatusRepository, ISuccessDayRepository, IUserRepository } from "@/domain/repositories";
import { CharacterDto } from "./dtos/CharacterDTO";


export class CharacterUsecase {
    constructor(
        private readonly statusRepository: IStatusRepository,
        private readonly IUserRepository: IUserRepository,
        private readonly characterRepository: ICharacterRepository,
        private readonly IQuestRepository: IQuestRepository,
        private readonly ISuccessDayRepository: ISuccessDayRepository
    ) {}
    
    async getStatusAndNickname(characterId: number, userId: number): Promise<CharacterDto> {  
        const characterStatus = await this.statusRepository.findByCharacterId(characterId);
        const characterNickname = await this.IUserRepository.findById(userId);
        const characterInfo = await this.characterRepository.findById(characterId);
    
        const today = new Date();
    
        // "오늘" 추가된 퀘스트만 가져오기
        const todayQuests = await this.IQuestRepository.findTodayQuests(characterId, today);
        const todayQuestIds = todayQuests?.map(quest => quest.id) || [];
        
        if (todayQuestIds.length === 0) {
            return {
                nickname: characterNickname?.nickname || "",
                progress: 0,
                str: characterStatus?.str || 0,
                int: characterStatus?.int || 0,
                emo: characterStatus?.emo || 0,
                fin: characterStatus?.fin || 0,
                liv: characterStatus?.liv || 0,
                endingCount: characterInfo?.endingCount || 0,
            };
        }
    
        // 오늘 완료된 퀘스트만 가져오기
        const successQuests = await this.ISuccessDayRepository.findCompletedQuests(todayQuestIds, today);

        // 완료된 퀘스트 ID Set 생성
        const completedQuestIds = new Set(successQuests.map(s => s.questId));
        const completedQuestsCount = todayQuestIds.filter(id => completedQuestIds.has(id)).length;
    
        // 진행률 계산 (오늘 추가된 퀘스트 기준)
        const progress = todayQuestIds.length > 0
            ? Math.round((completedQuestsCount / todayQuestIds.length) * 100)
            : 0;
    
        return {
            nickname: characterNickname?.nickname || "",
            progress,
            str: characterStatus?.str || 0,
            int: characterStatus?.int || 0,
            emo: characterStatus?.emo || 0,
            fin: characterStatus?.fin || 0,
            liv: characterStatus?.liv || 0,
            endingCount: characterInfo?.endingCount || 0,
        };
    }
}