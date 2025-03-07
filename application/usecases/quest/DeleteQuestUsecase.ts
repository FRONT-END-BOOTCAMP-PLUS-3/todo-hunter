import { IQuestRepository, ISuccessDayRepository } from "@/domain/repositories";
import { DeleteQuestDTO } from "@/application/usecases/quest/dtos";

export class DeleteQuestUseCase {
  constructor(
    private readonly PriQuestRepository: IQuestRepository,
    private readonly PriSuccessDayRepository: ISuccessDayRepository,
  ) {}

  async deleteQuest(dto: DeleteQuestDTO): Promise<void> {
    // 1. 해당 퀘스트가 존재하는지 확인
    const quest = await this.PriQuestRepository.findById(dto.id);
    if (!quest || quest.characterId !== dto.characterId) {
      throw new Error("퀘스트를 찾을 수 없습니다.");
    }

    // 2. successDays(완료 기록) 존재 여부 확인
    const successDays = await this.PriSuccessDayRepository.findByQuestId(dto.id);
    if (successDays.length > 0) {
      throw new Error("이미 완료된 퀘스트는 삭제할 수 없습니다.");
    }

    // 3. 완료되지 않은 퀘스트만 삭제
    await this.PriQuestRepository.delete(dto.id);
  }
}
