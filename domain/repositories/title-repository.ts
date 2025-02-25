import { Title } from "@prisma/client";

export interface TitleRepository {
  findById: (id: number) => Promise<Title | null>;
  findByIds: (ids: number[]) => Promise<Title[]>;
  findAll: () => Promise<Title[]>;
  findByReqStat: (reqStat: string) => Promise<Title[]>;
  findByReqStatAndValue: (
    reqStat: string,
    reqValue: number
  ) => Promise<Title[]>;
}
