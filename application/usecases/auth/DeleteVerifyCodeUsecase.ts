import { RdVerificationRepository } from "@/infrastructure/repositories/RdVerificationRepository";

export class DeleteVerifyCodeUsecase {
    constructor(private verificationRepository: RdVerificationRepository) {}

    async execute(email: string): Promise<void> {
        await this.verificationRepository.deleteVerificationCode(email);
    }
}
