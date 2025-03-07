import { IQuestRepository, IStatusRepository } from "@/domain/repositories";
import { CreateQuestDTO, GetQuestDTO } from "@/application/usecases/quest/dtos";
import { STATUS } from "@/constants";

export class CreateQuestUseCase {
  constructor(
    private readonly PriQuestRepository: IQuestRepository,
    private readonly PriStatusRepository: IStatusRepository
  ) {}

  async createQuest(dto: CreateQuestDTO): Promise<GetQuestDTO> {
    // STATUS가 올바른 값인지 검증
    if (!Object.keys(STATUS).includes(dto.tagged)) {
      throw new Error(`Invalid status tag: ${dto.tagged}`);
    }

    // 종료일이 없으면 반복 설정
    const expiredAt = dto.expiredAt ?? null;

    // 퀘스트 생성
    const quest = await this.PriQuestRepository.create({
      characterId: dto.characterId,
      name: dto.name,
      tagged: dto.tagged,
      isWeekly: dto.isWeekly,
      expiredAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 캐릭터의 상태(Status) 조회 (없으면 생성)
    let status = await this.PriStatusRepository.findByCharacterId(dto.characterId);
    if (!status) {
      status = await this.PriStatusRepository.create(dto.characterId);
    }

    // Response DTO 반환
    return {
      id: quest.id,
      characterId: quest.characterId,
      name: quest.name,
      tagged: quest.tagged as keyof typeof STATUS,
      isWeekly: quest.isWeekly,
      expiredAt: quest.expiredAt ?? undefined,
      createdAt: quest.createdAt,
      completedDates: [], // 생성 시 완료된 날짜 없음
    };
  }
}
