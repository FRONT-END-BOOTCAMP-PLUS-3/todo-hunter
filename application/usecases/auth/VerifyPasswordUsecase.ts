import bcrypt from "bcrypt";

export class VerifyPasswordUsecase {
  async execute(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}