import { jwtVerify } from "jose";

export class VerifyAccessTokenUsecase {
    // Access Token 검증
    async verify(accessToken: string) {
        try {
            const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
            const { payload } = await jwtVerify(accessToken, secret);
            return payload; // { id: string, ... } 형태로 반환
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async execute(accessToken: string) {
        return this.verify(accessToken);
    }
}
