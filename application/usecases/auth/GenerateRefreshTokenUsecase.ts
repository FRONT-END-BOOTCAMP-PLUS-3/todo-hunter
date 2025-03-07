// application/usecases/generateRefreshToken.ts
import jwt from 'jsonwebtoken';
import { IRdAuthenticationRepository } from '@/domain/repositories/IRdAuthenticationRepository';

export class GenerateRefreshTokenUsecase {
    private repository: IRdAuthenticationRepository;

    constructor(repository: IRdAuthenticationRepository) {
        this.repository = repository;
    }

    // Refresh Token 생성
    async generate(user: { id: string }) {
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES!, 10) });
        await this.repository.saveRefreshToken(user.id, refreshToken);
        return refreshToken;
    }

    async execute(user: { id: string }) {
        return this.generate(user);
    }
}
