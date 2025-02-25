// 줄바꿈 필요 시 배열로 지정
// 예) label: ["칭호 도감"] → label: ["칭호", "도감"]

// 메뉴 정보 배열 (5개로 고정 필수)
const menus = [
    { menu: "character", icon: "user", label: "캐릭터" },
    { menu: "cards", icon: "book-heart", label: ["버프", "카드"] },
    { menu: "quest", icon: "receipt", label: "퀘스트" }, // 중앙 버튼
    { menu: "titlebook", icon: "trophy", label: ["칭호", "도감"] },
    { menu: "ending", icon: "octagon-check", label: "엔딩" },
];

export default menus;