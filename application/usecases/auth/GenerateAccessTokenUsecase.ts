import { SignJWT } from "jose";

export class GenerateAccessTokenUsecase {
    // Access Token 생성
    async generate(user: { loginId: string }) {
        const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
        const iat = Math.floor(Date.now() / 1000);
        return await new SignJWT({ id: user.loginId, iat })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRES!) // 예: "1h"
            .sign(secret);
    }

    async execute(user: { loginId: string }) {
        return this.generate(user);
    }
}
