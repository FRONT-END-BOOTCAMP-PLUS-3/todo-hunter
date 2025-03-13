import { Status } from "@prisma/client";
import {
  ITitleRepository,
  IUserTitleRepository,
  ICharacterRepository,
  IStatusRepository,
} from "@/domain/repositories";
import { EndingDTO } from "@/application/usecases/ending/dtos";
import {
  ENDING_IMAGES,
  ENDING_PROMPTS,
  DEFAULT_ENDING_IMAGE,
  DEFAULT_ENDING_PROMPT,
} from "@/constants";

interface StatInfo {
  statName: string;
  value: number;
}

export class EndingUsecase {
  constructor(
    private readonly titleRepository: ITitleRepository,
    private readonly userTitleRepository: IUserTitleRepository,
    private readonly characterRepository: ICharacterRepository,
    private readonly statusRepository: IStatusRepository
  ) {}

  private findHighestStat(status: Status): StatInfo {
    const stats: StatInfo[] = [
      { statName: "STR", value: status.str },
      { statName: "INT", value: status.int },
      { statName: "EMO", value: status.emo },
      { statName: "FIN", value: status.fin },
      { statName: "LIV", value: status.liv },
    ];

    return stats.reduce((highest, current) =>
      current.value > highest.value ? current : highest
    );
  }

  private async saveOrUpdateUserTitle(
    characterId: number,
    titleId: number
  ): Promise<void> {
    const existingUserTitle =
      await this.userTitleRepository.findOneByCharacterIdAndTitleId(
        characterId,
        titleId
      );

    if (existingUserTitle) {
      await this.userTitleRepository.addCount(characterId, titleId);
    } else {
      await this.userTitleRepository.create(characterId, titleId);
    }
  }

  async execute(userId: number): Promise<EndingDTO> {
    const character = await this.characterRepository.findByUserId(userId);
    if (!character) {
      throw new Error("Character not found");
    }

    const status = await this.statusRepository.findByCharacterId(character.id);
    if (!status) {
      throw new Error("Status not found");
    }

    const highestStat = this.findHighestStat(status);

    const availableTitles = await this.titleRepository.findByReqStat(
      highestStat.statName
    );

    const matchingTitle = availableTitles
      .filter((title) => title.reqValue <= highestStat.value)
      .sort((a, b) => b.reqValue - a.reqValue)[0];

    if (!matchingTitle) {
      return {
        endingState: character.endingState,
        endingPrompt: DEFAULT_ENDING_PROMPT,
        endingImage: DEFAULT_ENDING_IMAGE,
        achievableTitle: {
          titleName: "방랑자",
          description: "아직 자신만의 길을 찾지 못한 여행자",
        },
      };
    }

    await this.saveOrUpdateUserTitle(character.id, matchingTitle.id);

    return {
      endingState: character.endingState,
      endingPrompt: ENDING_PROMPTS[matchingTitle.id] ?? DEFAULT_ENDING_PROMPT,
      endingImage: ENDING_IMAGES[matchingTitle.id] ?? DEFAULT_ENDING_IMAGE,
      achievableTitle: {
        titleName: matchingTitle.titleName,
        description: matchingTitle.description,
      },
    };
  }
}
