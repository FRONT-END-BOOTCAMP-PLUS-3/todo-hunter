import { CompleteQuestError } from "@/constants/error";
import { ICharacterRepository, IQuestRepository, IStatusRepository, ISuccessDayRepository } from "@/domain/repositories";

export class CompleteQuestUsecase {
  constructor(
  private PriQuestRepository: IQuestRepository,
  private PriSuccessDayRepository: ISuccessDayRepository,
  private PriCharacterRepository: ICharacterRepository,
  private PriStatusRepository: IStatusRepository,
) {}


  // 퀘스트 완료 처리 메서드
  async completeQuest(characterId: number, questId: number): Promise<void> {
    // 1. SuccessDay 모델에 퀘스트 완료 정보 삽입
    await this.PriSuccessDayRepository.create(questId);

    // 2. 해당 퀘스트를 찾아서 Character에 연결된 Status 정보 가져오기
    const quest = await this.PriQuestRepository.findById(questId);
    if (!quest) {
      throw new CompleteQuestError("QUEST_NOT_FOUND","퀘스트를 찾을 수 없습니다.");
    }

    const character = await this.PriCharacterRepository.findById(characterId);
    if (!character) {
      throw new CompleteQuestError("CHARACTER_NOT_FOUND","캐릭터를 찾을 수 없습니다.");
    }

    // 3. 퀘스트의 태그 값에 따라 Status 업데이트 (str, int, emo, fin, liv)
    const status = await this.PriStatusRepository.findByCharacterId(characterId);
    if (!status) {
      throw new CompleteQuestError("STATUS_NOT_FOUND","캐릭터의 상태 정보를 찾을 수 없습니다.");
    }

    const { tagged } = quest; // 퀘스트의 태그 값 (예: "str", "int", "emo" 등)

    // 태그에 따라 상태 값을 증가시킴
    switch (tagged) {
      case "str":
        status.str += 1;
        break;
      case "int":
        status.int += 1;
        break;
      case "emo":
        status.emo += 1;
        break;
      case "fin":
        status.fin += 1;
        break;
      case "liv":
        status.liv += 1;
        break;
      default:
        throw new CompleteQuestError("INVALID_TAG","유효하지 않은 태그입니다.");
    }

    // 4. 상태 값 업데이트
    await this.PriStatusRepository.update(status);
  }
}
