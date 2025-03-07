import  redisClient from '@/infrastructure/databases/redis/server';

import { IVerificationRepository } from '@/domain/repositories/IVerificationRepository';

export class RdVerificationRepository implements IVerificationRepository {

    async saveVerificationCode(email: string, code: string, expiresIn: number = 300): Promise<void> {
        await redisClient.set(`email:${email}`, code, "EX", expiresIn);
    };

    async getVerificationCode(email: string): Promise<string | null> {
        return await redisClient.get(`email:${email}`);
    }
    
    async deleteVerificationCode(email: string): Promise<void> {
        await redisClient.del(`email:${email}`);
    }

    async getVerificationCodeExpiration(email: string): Promise<number | null> {
        // Redis에서 키의 TTL을 가져옵니다.
        const ttl = await redisClient.ttl(`email:${email}`);
        if (ttl === -2) {
            // 키가 존재하지 않으면 null을 반환하여 예외를 처리하도록 합니다.
            return null;
        }
        if (ttl === -1) {
            // 만료 시간이 설정되지 않은 경우, -1을 반환하여 예외를 처리하도록 합니다.
            return null;
        }
        const expirationTime = Date.now() + ttl * 1000;
        return expirationTime;
    }
}