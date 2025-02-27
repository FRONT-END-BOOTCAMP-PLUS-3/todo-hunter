import { IQuestRepository, IStatusRepository, ISuccessDayRepository, IUserRepository } from "@/domain/repositories";
import { CharacterDto } from "./dtos/characterDto";


export class CharacterUsecase {
    constructor(
        private readonly statusRepository: IStatusRepository,
        private readonly IUserRepository: IUserRepository,
        private readonly IQuestRepository: IQuestRepository,
        private readonly ISuccessDayRepository: ISuccessDayRepository
    ) {}
    
    async getStatusAndNickname(characterId: number, userId:number): Promise<CharacterDto> {
        const characterStatus = await this.statusRepository.findByCharacterId(characterId);
        const characterNickname = await this.IUserRepository.findById(userId);

        // 퀘스트 진행률 구하기!!!!
        // 1. 현재 퀘스트 조회
        const currentQuests = await this.IQuestRepository.findCurrentQuests(characterId, new Date());
        // 1-1. 현재 퀘스트의 id 조회
        const currentQuestIds = currentQuests?.map((quest) => quest.id);

        // 2. 현재 퀘스트 중 성공한 퀘스트 조회 
        if (!currentQuestIds || currentQuestIds.length === 0)throw new Error("currentQuestIds not found");
        const successQuests = await this.ISuccessDayRepository.findCurrentQuests(currentQuestIds, new Date());

        // 3. 진행률 계산
        if (!successQuests) throw new Error("successQuests not found");
        const progress = Math.round((successQuests.length / currentQuestIds.length) * 100); 
        
        if (!characterStatus) throw new Error("characterStatus not found");
        if (!characterNickname) throw new Error("characterNickname not found");

        return{
            nickname: characterNickname.nickname,
            progress: progress,
            str: characterStatus.str,
            int: characterStatus.int,
            emo: characterStatus.emo,
            fin: characterStatus.fin,
            liv: characterStatus.liv,
        }
    }
}