// application/usecases/generateAccessToken.ts
import jwt from 'jsonwebtoken';

export class GenerateAccessTokenUsecase {
    // Access Token 생성
    generate(user: { id: string }) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES!, 10) });
    }

    async execute(user: { id: string }) {
        return this.generate(user);
    }
}
