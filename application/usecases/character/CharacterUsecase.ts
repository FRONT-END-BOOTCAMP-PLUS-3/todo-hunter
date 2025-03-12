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
    
    async getStatusAndNickname(characterId: number, userId:number): Promise<CharacterDto> {
        const characterStatus = await this.statusRepository.findByCharacterId(characterId);
        const characterNickname = await this.IUserRepository.findById(userId);
        const characterInfo = await this.characterRepository.findById(characterId);

        // 퀘스트 진행률 구하기!!!!
        // 1. 현재 퀘스트 조회
        const currentQuests = await this.IQuestRepository.findCurrentQuests(characterId, new Date());
        // 1-1. 현재 일간 퀘스트의 id 조회
        const currentQuestIds = currentQuests?.map((quest) => quest.id);

        // 퀘스트가 없다면 진행률을 0으로 처리
        if (!currentQuestIds || currentQuestIds.length === 0) {
          // 상황에 따라 빈 배열을 반환하거나 progress를 0으로 설정하는 로직을 추가할 수 있음
          // 예시:
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

        // 2. 현재 일간 퀘스트 중 성공한 퀘스트 조회 
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