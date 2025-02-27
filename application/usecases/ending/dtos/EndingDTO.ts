import { EndingState } from "@/constants";

export interface EndingDTO {
  endingState: EndingState; // 엔딩을 확인했는가? 2(안봄) or 3(봄)
  endingPrompt: string; // 엔딩 대사 프롬프트
  endingImage: string; // 엔딩 이미지 src
  achievableTitle: {
    titleName: string;
    description: string;
  }; // 칭호 이름과 설명
}

// 엔딩 페이지에서 필요한 데이터
// 1. 이미 엔딩을 확인했는가? -> UserStore.endingState === EndingDTO.EndingState
// 2. 이번 엔딩의 대사? -> 로직 처리 필요
// 3. 이번 엔딩의 이미지? -> 로직 처리 필요
