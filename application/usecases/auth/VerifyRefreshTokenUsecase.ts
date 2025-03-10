import { jwtVerify } from "jose";

export class VerifyRefreshTokenUsecase {
    // Refresh Token 검증
    async verify(token: string) {
        try {
            const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);
            const { payload } = await jwtVerify(token, secret);
            return payload; // { id: string, ... } 형태로 반환
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async execute(token: string) {
        return this.verify(token);
    }
}
