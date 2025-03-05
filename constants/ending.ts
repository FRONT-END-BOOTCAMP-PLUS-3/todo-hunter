// 엔딩 이미지 기본값
// export const DEFAULT_ENDING_IMAGE = "/endings/default.jpg";
export const DEFAULT_ENDING_IMAGE = "/endings/cyberpunk-street-background4.png";

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

// 페이드 시간
export const FADE_STEP_DURATION = 500; // 각 페이드 단계 시간 (ms)
export const TOTAL_FADE_DURATION = FADE_STEP_DURATION * 7; // 전체(7단계) 페이드 시간
export const TOAST_DELAY = 500; // 페이드 완료 후 토스트 표시 대기 시간
