import { EndingType } from "@/constants";

// 엔딩 프롬프트
export const ENDING_PROMPTS: Record<EndingType, string> = {
  [EndingType.BALANCED]: "당신은 모든 면에서 균형잡힌 삶을 살았습니다...",
  [EndingType.WORKAHOLIC]: "일에 모든 것을 바친 당신, 성공이라는 정상에 섰지만...",
  [EndingType.EMOTIONAL]: "감성이 풍부한 당신은 주변 사람들에게 많은 영감을...",
  [EndingType.INTELLECTUAL]: "지식을 추구하는 삶을 선택한 당신은...",
  // ... 엔딩 프롬프트
};

// 엔딩 이미지 경로
export const ENDING_IMAGES: Record<EndingType, string> = {
  [EndingType.BALANCED]: "/images/endings/balanced.jpg",
  [EndingType.WORKAHOLIC]: "/images/endings/workaholic.jpg",
  [EndingType.EMOTIONAL]: "/images/endings/emotional.jpg",
  [EndingType.INTELLECTUAL]: "/images/endings/intellectual.jpg",
  // ... 엔딩 이미지 경로
};

// 엔딩 판정 기준값
export const ENDING_THRESHOLDS = {
  BALANCED: {
    minValue: 20, // 모든 스탯이 이 값 이상
    maxDiff: 10, // 최대-최소 스탯 차이가 이 값 이하
  },
  WORKAHOLIC: {
    fin: 40, // 재정 스탯이 이 값 이상
    str: 30, // 힘 스탯이 이 값 이상
  },
  // ... 엔딩 조건
};
