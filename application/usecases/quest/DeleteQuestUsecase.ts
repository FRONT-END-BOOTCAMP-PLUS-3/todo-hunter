import { IQuestRepository } from "@/domain/repositories";
import { DeleteQuestDTO } from "@/application/usecases/quest/dtos";

export class DeleteQuestUseCase {
  constructor(
    private readonly PriQuestRepository: IQuestRepository,
  ) {}

  async deleteQuest(dto: DeleteQuestDTO): Promise<void> {
    // 1. 해당 퀘스트가 존재하는지 확인
    const quest = await this.PriQuestRepository.findById(dto.id);

    if (!quest || quest.characterId !== dto.characterId) {
      throw new Error("퀘스트를 찾을 수 없습니다.");
    }

    // 2. 퀘스트 삭제
    await this.PriQuestRepository.delete(dto.id);
  }
}
