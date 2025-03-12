import { PrismaClient, UserTitle } from "@prisma/client";
import { IUserTitleRepository } from "@/domain/repositories";

const DEFAULT_PAGE_SIZE = 9; // 1개 페이지 당 기본 사이즈 (칭호 페이지 로드 시 사용)

export class PriUserTitleRepository implements IUserTitleRepository {
  constructor(private readonly prisma: PrismaClient) {} // 의존성 주입

  // 레코드 생성 메서드
  async create(characterId: number, titleId: number): Promise<UserTitle> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.userTitle.create({
        data: {
          characterId: characterId,
          titleId: titleId,
          count: 1,  // 기본 값 1
          isSelected: false,  // 기본 값 false
          createdAt: new Date(), // 생성일
        },
      });
    });
  }

  // 모든 획득한 칭호를 가져오는 메서드 (페이지네이션 방식) (기본값 10)
  async findAllByCharacterId(characterId: number, page: number): Promise<UserTitle[]> {
    return await this.prisma.userTitle.findMany({
      where: {
        characterId: characterId,  // 주어진 character_id에 해당하는 모든 UserTitle을 조회
      },
      orderBy: {
        createdAt: 'desc',  // 생성일 기준 내림차순 정렬
      },
      skip: (page - 1) * DEFAULT_PAGE_SIZE,  // 페이지 계산: 첫 번째 페이지는 0개 건너뛰고, 두 번째 페이지는 10개 건너뛰기 등
      take: DEFAULT_PAGE_SIZE,               // 페이지 크기만큼 데이터 가져오기
    });
  }

  // 모든 정보를 읽어오는 메서드
  async findOneByCharacterIdAndTitleId(characterId: number, titleId: number): Promise<UserTitle | null> {
    return await this.prisma.userTitle.findUnique({
      where: {
        characterId_titleId: {
          characterId: characterId,
          titleId: titleId,
        },
      },
    });
  }

  // character_id와 title_id가 일치할 경우 count를 1 올려주는 update 메서드
  async addCount(characterId: number, titleId: number): Promise<UserTitle> {
    return await this.prisma.userTitle.update({
      where: {
        characterId_titleId: {
          characterId: characterId,
          titleId: titleId,
        },
      },
      data: {
        count: {
          increment: 1, // count 값 1 증가
        },
      },
    });
  }

  // character_id와 title_id가 일치하면 is_selected를 true로 업데이트하는 메서드
  async setSelectTrue(characterId: number, titleId: number): Promise<UserTitle> {
    return await this.prisma.userTitle.update({
      where: {
        characterId_titleId: {
          characterId: characterId,
          titleId: titleId,
        },
      },
      data: {
        isSelected: true,
      },
    });
  }

  // character_id와 title_id가 일치하면 is_selected를 false로 업데이트하는 메서드
  async setSelectFalse(characterId: number, titleId: number): Promise<UserTitle> {
    return await this.prisma.userTitle.update({
      where: {
        characterId_titleId: {
          characterId: characterId,
          titleId: titleId,
        },
      },
      data: {
        isSelected: false,
      },
    });
  }
}
