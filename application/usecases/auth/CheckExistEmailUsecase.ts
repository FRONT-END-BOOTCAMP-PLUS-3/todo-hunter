import { IUserRepository } from "@/domain/repositories";
import { CheckExistEmailDTO } from "./dtos/CheckExistEmailDTO";

export class CheckExistEmailUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}
    
    async execute(request: CheckExistEmailDTO): Promise<boolean> {
        const user = await this.userRepository.findByEmail(request.email);
        return !!user;
    }
}