import { Status } from "@prisma/client";

export interface StatusRepository {
  findById: (id: number) => Promise<Status | null>;
  findByCharacterId: (characterId: number) => Promise<Status | null>;
  update: (user: Status) => Promise<Status>;
}
