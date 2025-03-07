import { prisma } from "@/lib/prisma";
// import { cookies } from "next/headers";

export async function getUserFromCookie(req: Request) {
  // DB에서 첫 번째 유저와 연결된 캐릭터 가져오기
  const testUser = await prisma.user.findFirst({
    include: {
      characters: true, // 유저의 캐릭터 정보도 함께 가져오기
    },
  });

  if (!testUser || testUser.characters.length === 0) return null;

  return {
    characterId: testUser.characters[0].id,
    nickname: testUser.nickname, // User nickname 사용
    userId: testUser.id, // User ID 추가 
  };
}
