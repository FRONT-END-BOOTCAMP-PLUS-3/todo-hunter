import { IUserRepository } from "@/domain/repositories";
import { VerifyPasswordUsecase } from "./VerifyPasswordUsecase";
import { SignInRequestDTO } from "./dtos/SignInRequestDTO";
import { LoginError } from "@/constants/error";
import { SignInResponseDTO } from "./dtos/SignInResponseDTO";

export class SignInUsecase {
    constructor (
        private readonly userRepository: IUserRepository,
        private readonly verifyPasswordUsecase: VerifyPasswordUsecase,
    ) {}

    async execute(request: SignInRequestDTO): Promise<SignInResponseDTO> {

        if (!request.loginId?.trim() || !request.password?.trim()) {
            throw new LoginError("MISSING_CREDENTIALS","이메일과 비밀번호를 모두 입력해주세요.")
        }

        const user = await this.userRepository.findByLoginId(request.loginId);
        if (!user) {
            throw new LoginError("LOGIN_ID_NOT_FOUND", "가입되지 않은 아이디입니다.");
        }

        const { password } = user;
        const isPasswordValid = await this.verifyPasswordUsecase.execute(request.password, password);
        
        if (!isPasswordValid) {
            throw new LoginError("INVALID_PASSWORD", "비밀번호가 올바르지 않습니다.");
        }

        return {
            user: {
                loginId: request.loginId,
                nickname: user.nickname,
                createdAt: user.createdAt,
            }
        };
    }
}