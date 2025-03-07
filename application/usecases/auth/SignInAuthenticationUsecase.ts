// domain/usecases/authentication.ts
import { IRdAuthenticationRepository } from '@/domain/repositories/IRdAuthenticationRepository';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: { id: string }) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = async (user: { id: string }, repository: IRdAuthenticationRepository) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1d' });
    await repository.saveRefreshToken(user.id, refreshToken);
    return refreshToken;
};

export const refreshTokens = async (refreshToken: string, repository: IRdAuthenticationRepository) => {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    if (!decoded) return null;

    const storedToken = await repository.getRefreshToken(decoded.id);
    if (storedToken !== refreshToken) return null;

    const newAccessToken = generateAccessToken({ id: decoded.id });
    const newRefreshToken = await generateRefreshToken({ id: decoded.id }, repository);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error(error);
        return null;
    }
};
