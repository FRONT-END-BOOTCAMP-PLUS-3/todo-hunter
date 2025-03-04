import bcrypt from "bcrypt";
import { IVerifyPasswordUsecase } from "./interfaces/IVerifyPasswordUsecase";

export class VerifyPasswordUsecase implements IVerifyPasswordUsecase {
  async execute(password: string, hashed: string): Promise<boolean> {
    // bcrypt로 해싱된 비밀번호(만) 검증
    //return await bcrypt.compare(password, hashed);

    // bcrypt로 해싱된 비밀번호 검증
    const isBcryptValid = await bcrypt.compare(password, hashed);
    if (isBcryptValid) {
      return true;
    }

    // bcrypt로 해싱되지 않은 비밀번호 검증 (bcrypt로 해싱된 비밀번호 검증 실패 시)
    return password === hashed;
  }
}