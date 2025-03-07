// 줄바꿈 필요 시 배열로 지정 (2줄 이상 불가)
// 예) label: ["칭호 도감"] → label: ["칭호", "도감"]

type MenusDto = {
  menu: string;
  icon: string;
  label: string | string[];
  disabled?: boolean; // 특정 요소 비활성화 필요 시 disabled 속성 추가
};

// 메뉴 정보 배열 (5개로 고정 필수)
export const MENUS: MenusDto[] = [
    { menu: "character", icon: "user", label: "캐릭터" },
    { menu: "cards", icon: "book-heart", label: ["버프", "카드"], disabled: true }, 
    { menu: "quest", icon: "receipt", label: "퀘스트" }, // 중앙 버튼
    { menu: "title", icon: "trophy", label: ["칭호", "도감"] },
    { menu: "ending", icon: "octagon-check", label: "엔딩" }
];
