// application/usecases/VerifyRefreshToken.ts
import jwt from 'jsonwebtoken';

export class VerifyRefreshTokenUsecase {
    // Refresh Token 검증
    verify(token: string) {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async execute(token: string) {
        return this.verify(token);
    }
}
