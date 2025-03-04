import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST, // Redis 서버 주소
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379, // Redis 기본 포트
  db: 0, // 사용할 데이터베이스 번호 (기본 0번 사용)
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redisClient;