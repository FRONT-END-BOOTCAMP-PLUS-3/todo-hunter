export class GenerateVerifyCodeUsecase {
  execute(): string {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6자리 숫자 코드 생성
  }
}