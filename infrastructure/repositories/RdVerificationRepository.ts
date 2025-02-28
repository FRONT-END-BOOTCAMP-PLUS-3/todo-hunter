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
}