// 현재 사용하지 않는 파일 (추후 제거 예정)
import jwt from 'jsonwebtoken';

// 사용자 정보 타입 정의 (재사용 가능)
interface UserPayload {
  loginId: string;
  nickname: string;
  createdAt: string;
}

const SECRET = process.env.JWT_SECRET_KEY || '';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '';

// access Token 발급
const generateAccessToken = (user: UserPayload) => {
  return jwt.sign(
    {
      loginId: user.loginId,
      nickname: user.nickname,
      createdAt: user.createdAt,
    },
    SECRET as jwt.Secret,
    {
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: ACCESS_EXPIRES_IN, // 유효기간
    } as jwt.SignOptions
  );
};

// access Token 검증
const verifyAccessToken = (token: string) => {
  let decoded: UserPayload | null = null;
  try {
    decoded = jwt.verify(token, SECRET) as UserPayload;
    return {
      ok: true,
      loginId: decoded.loginId,
      nickname: decoded.nickname,
      createdAt: decoded.createdAt,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      message: (error instanceof Error) ? error.message : 'Unknown error',
    };
  }
};

// refresh Token 발급
const generateRefreshToken = (user: UserPayload) => {
  return jwt.sign(
    {
      loginId: user.loginId,
      nickname: user.nickname,
      createdAt: user.createdAt,
    },
    SECRET as jwt.Secret,
    {
      algorithm: 'HS256',
      expiresIn: REFRESH_EXPIRES_IN, // 유효기간
    } as jwt.SignOptions
  );
};

// refresh Token 검증
const verifyRefreshToken = (token: string) => {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch (error: unknown) {
    console.log("message: ", (error instanceof Error) ? error.message : 'Unknown error');
    return false;
  }
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};