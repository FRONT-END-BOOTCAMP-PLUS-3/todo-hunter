import jwt from 'jsonwebtoken';

export class VerifyAccessTokenUsecase {
    // Access Token 검증
    verify(accessToken: string) {
        try {
            return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async execute(accessToken: string) {
        return this.verify(accessToken);
    }
}
