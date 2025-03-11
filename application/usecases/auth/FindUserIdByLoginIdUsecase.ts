import { IUserRepository } from "@/domain/repositories";

export class FindUserIdByLoginIdUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(loginId: string): Promise<string> {
        const user = await this.userRepository.findByLoginId(loginId);
        if (user === null) {
            throw new Error("User not found");
        }
        return user.id.toString();
    }
}