import { ICharacterRepository, IStatusRepository, IUserRepository } from "@/domain/repositories";
import { IRdAuthenticationRepository } from "@/domain/repositories/IRdAuthenticationRepository";
import { SignUpRequestDTO } from "./dtos/SignUpRequestDTO";
// import { createTokens } from "@/utils/auth";
import { GenerateAccessTokenUsecase } from "./GenerateAccessTokenUsecase";
import { GenerateRefreshTokenUsecase } from "./GenerateRefreshTokenUsecase";

export class SignUpUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly characterRepository: ICharacterRepository,
    private readonly statusRepository: IStatusRepository,
    private readonly rdAuthenticationRepository: IRdAuthenticationRepository // Refresh Token 저장을 위한 의존성 추가
  ) {}

  // async execute(request: SignUpRequestDTO): Promise<void>
  async execute(request: SignUpRequestDTO): Promise<{ accessToken: string; refreshToken: string; }> {
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

    // 유즈케이스를 사용해 토큰 생성
    const accessTokenUsecase = new GenerateAccessTokenUsecase();
    const refreshTokenUsecase = new GenerateRefreshTokenUsecase(this.rdAuthenticationRepository);

    const userPayload = { loginId: user.loginId }; // GenerateAccessTokenUsecase와 GenerateRefreshTokenUsecase가 요구하는 형식
    const accessToken = await accessTokenUsecase.execute(userPayload);
    const refreshToken = await refreshTokenUsecase.execute(userPayload);

    // // 필요에 따라 토큰 반환 또는 사용
    // return tokens;

    return { accessToken, refreshToken };
  }
}