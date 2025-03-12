import { IUserRepository } from "@/domain/repositories";

export class FindLoginIdByEmailUsecase {
    constructor (
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(email: string): Promise<string> {
        const loginId = await this.userRepository.findLoginIdByEmail(email);
        if (loginId === null) {
            throw new Error("Login ID not found");
        }
        return loginId;
    }
}