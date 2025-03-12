import { UserTitle } from "@prisma/client";

export interface IUserTitleRepository {
  create: (characterId: number, titleId: number) => Promise<UserTitle>;
  findAllByCharacterId: (characterId: number, page: number) => Promise<UserTitle[]>;
  findOneByCharacterIdAndTitleId: (characterId: number, titleId: number) => Promise<UserTitle | null>;
  addCount: (characterId: number, titleId: number) => Promise<UserTitle>;
  setSelectTrue: (characterId: number, titleId: number) => Promise<UserTitle>;
  setSelectFalse: (characterId: number, titleId: number) => Promise<UserTitle>;
}
