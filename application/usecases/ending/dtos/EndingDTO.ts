import { EndingState } from "@/constants";

export interface EndingDTO {
  endingState: EndingState; // 엔딩을 확인했는가? 2(안봄) or 3(봄)
  endingPrompt: string; // 엔딩 대사 프롬프트
  endingImage: string; // 엔딩 이미지 src
  achievableTitle: {
    titleName: string;
    description: string;
  };
}
