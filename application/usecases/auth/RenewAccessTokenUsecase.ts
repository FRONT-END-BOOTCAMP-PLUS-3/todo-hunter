import { RdAuthenticationRepository } from '@/infrastructure/repositories/RdAuthenticationRepository';
import { GenerateAccessTokenUsecase } from './GenerateAccessTokenUsecase';
import { VerifyAccessTokenUsecase } from './VerifyAccessTokenUsecase';

export class RenewAccessTokenUsecase {
    constructor(private authenticationRepository: RdAuthenticationRepository) {}

    // 새로운 Access Token 생성
    async execute(user: { loginId: string }) {
        const generateAccessTokenUsecase = new GenerateAccessTokenUsecase();
        return generateAccessTokenUsecase.execute(user);
    }

    // 기존 Access Token 검증 후 새로운 Access Token 발급
    async refresh(accessToken: string) {
        const verifyAccessTokenUsecase = new VerifyAccessTokenUsecase();
        const decoded = await verifyAccessTokenUsecase.execute(accessToken);

        // `decoded`가 JwtPayload 타입인지 확인하고, 안전하게 `id`에 접근
        if (!decoded || typeof decoded === 'string') return null;

        // `decoded`가 JwtPayload 타입임을 확신할 수 있으므로 `id` 속성에 안전하게 접근
        const newAccessToken = await new GenerateAccessTokenUsecase().execute({ loginId: (decoded as { id: string }).id });

        return newAccessToken;
    }
}
