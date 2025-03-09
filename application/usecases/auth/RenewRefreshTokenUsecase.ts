import { RdAuthenticationRepository } from '@/infrastructure/repositories/RdAuthenticationRepository';
import { GenerateRefreshTokenUsecase } from './GenerateRefreshTokenUsecase';
import { VerifyRefreshTokenUsecase } from './VerifyRefreshTokenUsecase';
import { IRdAuthenticationRepository } from '@/domain/repositories/IRdAuthenticationRepository';

export class RenewRefreshTokenUsecase {
    constructor(private authenticationRepository: IRdAuthenticationRepository) {}

    // 새로운 Refresh Token 생성
    async execute(user: { loginId: string }) {
        await this.authenticationRepository.deleteRefreshToken(user.loginId);
        const generateRefreshTokenUsecase = new GenerateRefreshTokenUsecase(this.authenticationRepository);
        return generateRefreshTokenUsecase.execute(user);
    }

    // 기존 Refresh Token을 검증 후 새로운 Refresh Token 발급
    async refresh(refreshToken: string) {
        const verifyRefreshTokenUsecase = new VerifyRefreshTokenUsecase();
        const decoded = await verifyRefreshTokenUsecase.execute(refreshToken);
        if (!decoded) return null;

        const rdAuthenticationRepository = new RdAuthenticationRepository();
        const generateRefreshTokenUsecase = new GenerateRefreshTokenUsecase(rdAuthenticationRepository);
        if (typeof decoded === 'string' || !decoded.id) return null;
        // const newRefreshToken = await generateRefreshTokenUsecase.execute({ id: decoded.id });
        const newRefreshToken = await generateRefreshTokenUsecase.execute({ loginId: (decoded as { id: string }).id });
        return newRefreshToken;
    }
}
