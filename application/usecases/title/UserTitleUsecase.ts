import { TITLE_IMAGES } from "@/constants/title";
import { ITitleRepository, IUserTitleRepository } from "@/domain/repositories";

export class UserTitleUsecase {
    constructor(
        private readonly IUserTitleRepository: IUserTitleRepository,
        private readonly ITitleRepository: ITitleRepository,
    ) {}

    async getUserTitles(characterId: number, page: number) {
        // 1. 사용자가 가지고 있는 타이틀 ID 목록을 조회
        const userTitles = await this.IUserTitleRepository.findAllByCharacterId(characterId, page);
        console.log("userTitles", userTitles);

        // 2. 타이틀 ID 목록을 사용하여 타이틀 정보 조회
        const titleIds = userTitles.map(userTitle => userTitle.titleId);
        const titles = await this.ITitleRepository.findManyByIds(titleIds);
        console.log("titles", titles);

        // 3. 필요한 데이터를 반환
        return titles.map(title => ({
            name: title.titleName,
            count: userTitles.find(userTitle => userTitle.titleId === title.id)?.count || 0,
            description: title.description,
            reqStat: title.reqStat,
            reqValue: title.reqValue,
            img: TITLE_IMAGES[title.id],
        }));
    }

}
