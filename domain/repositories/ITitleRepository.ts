import { Title } from "@prisma/client";

export interface ITitleRepository {
  findById: (id: number) => Promise<Title | null>;
  findManyByIds: (ids: number[]) => Promise<Title[]>;
  findAll: () => Promise<Title[]>;
  findByReqStat: (reqStat: string) => Promise<Title[]>;
  findByReqStatAndValue: (
    reqStat: string,
    reqValue: number
  ) => Promise<Title[]>;
}
