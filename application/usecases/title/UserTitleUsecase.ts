import { ITitleRepository, IUserTitleRepository } from "@/domain/repositories";

export class UserTitleUsecase {
    constructor(
        private readonly IUserTitleRepository: IUserTitleRepository,
        private readonly ITitleRepository: ITitleRepository,
    ) {}

    async getUserTitles(characterId: number, page: number, pageSize: number) {
        // 1. 사용자가 가지고 있는 타이틀 ID 목록을 조회
        const userTitles = await this.IUserTitleRepository.findAllByCharacterId(characterId, page, pageSize);
        if (!userTitles || userTitles.length === 0) throw new Error("User titles not found");

        // 2. 타이틀 ID 목록을 사용하여 타이틀 정보 조회
        const titleIds = userTitles.map(userTitle => userTitle.titleId);
        const titles = await this.ITitleRepository.findManyByIds(titleIds);
        if (!titles || titles.length === 0) throw new Error("Titles not found");

        // 3. 필요한 데이터를 반환
        return titles.map(title => ({
            name: title.titleName,
            count: userTitles.find(userTitle => userTitle.titleId === title.id)?.count || 0,
            description: title.description,
            reqStat: title.reqStat,
            reqValue: title.reqValue,
            // img: title.img,
        }));
    }

}
