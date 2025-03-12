import { Status } from "@prisma/client";

export interface IStatusRepository {
  create: (characterId: number) => Promise<Status>;
  findById: (id: number) => Promise<Status | null>;
  findByCharacterId: (characterId: number) => Promise<Status | null>;
  update: (user: Status) => Promise<Status>;
}
