import { ICharacterRepository, IStatusRepository, IUserRepository } from "@/domain/repositories";
import { SignUpDTO } from "./dtos/SignUpDTO";

export class SignUpUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly characterRepository: ICharacterRepository,
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute(request: SignUpDTO): Promise<void> {
    const user = await this.userRepository.create({
      loginId: request.loginId,
      email: request.email,
      password: request.password,
      nickname: request.nickname,
    });

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

    let endingState = 1;
    if (dayOfWeek === 0) { // 일요일
      endingState = 0;
    }

    const character = await this.characterRepository.create(user.id, endingState);
    await this.statusRepository.create(character.id);
  }
}