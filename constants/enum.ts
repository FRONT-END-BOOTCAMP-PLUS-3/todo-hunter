export enum EndingState {
  PENDING = 0, // 일요일 가입자 - 엔딩 확인 불가
  DISABLED = 1, // 평일 또는 월요일 전환 후 - 엔딩 확인 불가
  ENABLED = 2, // 일요일 - 엔딩 확인 가능 & 칭호 수여 가능
  CHECKED = 3, // 엔딩 확인 완료 - 엔딩 재확인 가능 & 칭호 수여 불가
}
