import { IUserRepository } from "@/domain/repositories";
import { CheckExistLoginIdDTO } from "./dtos/CheckExistLoginIdDTO";

export class CheckExistLoginIdUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async execute(request: CheckExistLoginIdDTO): Promise<boolean> {
        const user = await this.userRepository.findByLoginId(request.loginId);
        return !!user;
    }
}