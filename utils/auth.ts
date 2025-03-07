import jwt from "jsonwebtoken";

// 사용자 정보 타입 정의 (재사용 가능)
interface UserPayload {
  loginId: string;
  nickname: string;
  createdAt: string;
}

// 현재 쿠키에서 유저 정보 가져오는 걸 미들웨어에서 처리할 예정이라 getUserFromCookie 함수는 주석 처리 (추후 제거 예정)

// export async function getUserFromCookie(req: Request) {
//   // DB에서 첫 번째 유저와 연결된 캐릭터 가져오기
//   const testUser = await prisma.user.findFirst({
//     include: {
//       characters: true, // 유저의 캐릭터 정보도 함께 가져오기
//     },
//   });

//   if (!testUser || testUser.characters.length === 0) return null;

//   return {
//     characterId: testUser.characters[0].id,
//     nickname: testUser.nickname, // User nickname 사용
//     userId: testUser.id, // User ID 추가 
//   };
// }

// 토큰 생성 및 검증 (jwt.ts에서 정의한 로직을 가져옴)
export const createTokens = (user: UserPayload) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES!, 10) });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES!, 10) });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (error) {
    console.error(error);
    throw new Error("Invalid Access Token");
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (error) {
    console.error(error);
    throw new Error("Invalid Refresh Token");
  }
};
