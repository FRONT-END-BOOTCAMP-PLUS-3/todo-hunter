// 엔딩 이미지 기본값
export const DEFAULT_ENDING_IMAGE = "/images/endings/default.jpg";

// 엔딩 프롬프트 기본값
export const DEFAULT_ENDING_PROMPT = "당신만의 특별한 여정이 새로운 이야기를 만들어냈습니다...";

// 엔딩 프롬프트
export const ENDING_PROMPTS: Record<number, string> = {
  1: "강인한 체력으로 무장한 당신은 어떤 도전도 두렵지 않습니다...",
  2: "지식을 추구하는 삶을 선택한 당신은 깊이 있는 통찰력을 얻었습니다...",
  3: "풍부한 감성으로 주변 사람들에게 영감을 주는 당신...",
  // add
};

// 엔딩 이미지
export const ENDING_IMAGES: Record<number, string> = {
  1: "/endings/ending1.jpg",
  2: "/endings/ending2.jpg",
  3: "/endings/ending3.jpg",
  // add
};
