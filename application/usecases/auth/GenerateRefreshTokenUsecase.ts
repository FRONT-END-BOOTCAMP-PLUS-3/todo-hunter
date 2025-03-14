import { SignJWT } from "jose";
import { IRdAuthenticationRepository } from '@/domain/repositories/IRdAuthenticationRepository';

export class GenerateRefreshTokenUsecase {
    private repository: IRdAuthenticationRepository;

    constructor(repository: IRdAuthenticationRepository) {
        this.repository = repository;
    }

    // Refresh Token 생성
    async generate(user: { id: number, loginId: string }) {
        const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);
        const iat = Math.floor(Date.now() / 1000);
        const refreshToken = await new SignJWT({ id: user.id, loginId: user.loginId, iat })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRES!) // 예: "7d"
            .sign(secret);
        await this.repository.saveRefreshToken(user.loginId, refreshToken);
        return refreshToken;
    }

    async execute(user: { id: number, loginId: string }) {
        return this.generate(user);
    }
}
