// infrastructure/repositories/RdAuthenticationRepository.ts
import { IRdAuthenticationRepository } from '@/domain/repositories/IRdAuthenticationRepository';
import redisClient from '@/infrastructure/databases/redis/server';

export class RdAuthenticationRepository implements IRdAuthenticationRepository {
    async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await redisClient.set(userId, refreshToken, 'EX', 86400); // 24시간 만료
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        return await redisClient.get(userId);
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        await redisClient.del(userId);
    }

    // Access Token은 Redis에 저장하지 않습니다.
    // Access Token은 JWT로 발급되며, 검증만 수행합니다.
}
