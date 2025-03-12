import { RdVerificationRepository } from "@/infrastructure/repositories/RdVerificationRepository";
import { VerifyCodeError } from "./errors/VerifyCodeError";

export class CheckVerifyCodeUsecase {
    constructor(private verificationRepository : RdVerificationRepository) {}

    async execute(email: string, verificationCode: string): Promise<boolean> {
        const savedCode = await this.verificationRepository.getVerificationCode(email);
        const expirationTime = await this.verificationRepository.getVerificationCodeExpiration(email);

        if(!savedCode) {
            throw new VerifyCodeError("INVALID_CODE", "인증코드가 존재하지 않습니다.");
        }

        const currentTime = new Date().getTime();
        if (expirationTime !== null && currentTime > expirationTime) {
            throw new VerifyCodeError("EXPIRED_CODE", "인증코드가 만료되었습니다.");
        }

        const isValid = savedCode === verificationCode;

        if(isValid) {
            await this.verificationRepository.deleteVerificationCode(email);
        }

        return isValid;
    }
}