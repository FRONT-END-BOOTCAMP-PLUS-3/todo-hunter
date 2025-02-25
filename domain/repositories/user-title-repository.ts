import { UserTitle } from "@prisma/client";

export interface UserTitleRepository {
  createUserTitle: (characterId: number, titleId: number) => Promise<UserTitle>;
  findAllByCharacterId: (characterId: number, page: number, pageSize: number) => Promise<UserTitle[]>;
  findOneByCharacterIdAndTitleId: (characterId: number, titleId: number) => Promise<UserTitle | null>;
  addCount: (characterId: number, titleId: number) => Promise<UserTitle>;
  setSelectTrue: (characterId: number, titleId: number) => Promise<UserTitle>;
  setSelectFalse: (characterId: number, titleId: number) => Promise<UserTitle>;
}
