import { CompleteQuestError } from "@/application/usecases/quest/errors/CompleteQuestError";
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
    console.log(`completeQuest 실행됨! characterId: ${characterId}, questId: ${questId}`);

    // 1. 해당 퀘스트를 찾아서 `characterId` 검증
    const quest = await this.PriQuestRepository.findById(questId);
    if (!quest) {
        throw new CompleteQuestError("QUEST_NOT_FOUND", "퀘스트를 찾을 수 없습니다.");
    }
    if (quest.characterId !== characterId) {
    }

    // 2. SuccessDay에 이미 완료된 퀘스트인지 확인 (중복 방지)
    const existingSuccess = await this.PriSuccessDayRepository.findByQuestId(questId);
    if (existingSuccess.length > 0) {
        console.log(`이미 완료된 퀘스트입니다. questId: ${questId}`);
        return;
    }

    // 3. SuccessDay에 퀘스트 완료 기록 추가
    const successDay = await this.PriSuccessDayRepository.create(questId);
    console.log("SuccessDay 저장 완료:", successDay);

    // 4. 캐릭터 상태(Status) 가져오기
    const characterStatus = await this.PriStatusRepository.findByCharacterId(characterId);
    if (!characterStatus) {
        throw new CompleteQuestError("STATUS_NOT_FOUND", "캐릭터 상태 정보를 찾을 수 없습니다.");
    }

    // 5. 퀘스트의 태그 값을 기반으로 상태 업데이트
    const { tagged } = quest;
    console.log("업데이트할 스탯:", tagged);

    switch (tagged) {
        case "STR":
            characterStatus.str += 1;
            break;
        case "INT":
            characterStatus.int += 1;
            break;
        case "EMO":
            characterStatus.emo += 1;
            break;
        case "FIN":
            characterStatus.fin += 1;
            break;
        case "LIV":
            characterStatus.liv += 1;
            break;
        default:
            throw new CompleteQuestError("INVALID_TAG", "유효하지 않은 태그입니다.");
    }

    // 6. 상태 업데이트
    await this.PriStatusRepository.update(characterStatus);
    console.log("상태 업데이트 완료:", characterStatus);
}
}
