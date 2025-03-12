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
        console.log(`getStatusAndNickname 실행, characterId: ${characterId}, userId: ${userId}`);
        const characterStatus = await this.statusRepository.findByCharacterId(characterId);
        const characterNickname = await this.IUserRepository.findById(userId);
        const characterInfo = await this.characterRepository.findById(characterId);
    
        // 현재 퀘스트 조회
        const currentQuests = await this.IQuestRepository.findCurrentQuests(characterId, new Date());
        const currentQuestIds = currentQuests?.map(quest => quest.id) || [];
    
        console.log("현재 퀘스트 ID:", currentQuestIds);
    
        if (currentQuestIds.length === 0) {
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
    
        // `SuccessDay`에서 완료된 퀘스트 개수 확인
        const successQuests = (await this.ISuccessDayRepository.findCurrentQuests(currentQuestIds, new Date())) || [];
        console.log("성공한 퀘스트 개수:", successQuests.length);
        console.log("성공한 퀘스트 ID:", successQuests.map(s => s.questId));
    
        // 진행률 계산 (현재 퀘스트 중 완료된 것만 카운트)
        const completedQuestIds = new Set(successQuests.map(s => s.questId));
        const completedCurrentQuests = currentQuestIds.filter(id => completedQuestIds.has(id));
    
        const progress = currentQuestIds.length > 0
            ? Math.round((completedCurrentQuests.length / currentQuestIds.length) * 100)
            : 0;
    
        console.log(`계산된 진행률: ${progress}%`);
    
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