export function sendSignUpEmailTemplate(verificationCode: string): string {
  return `<!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>이메일 인증</title>
    </head>
    <body style="font-family: 'Pretendard', sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div
        style="
          width: 33.75rem;
          height: auto;
          border-top: 4px solid #89D9E9;
          border-bottom: 2px solid #d0d0d0;
          margin: 0.625rem;
          padding: 1.875rem;
          text-align: left;
          font-family: 'Pretendard', sans-serif;
        "
      >
        <!-- 제목 -->
        <h2 style="font-size: 1.5rem; color: #89D9E9;">TODO HUNTER 가입 인증코드 안내입니다.</h2>

        <!-- 본문 내용 -->
        <div style="margin: 3.75rem 0;">
          <p style="font-size: 0.875rem; margin-bottom: 0.625rem;">안녕하세요.</p>
          <p style="font-size: 0.875rem; margin-bottom: 0.625rem;">요청하신 이메일 인증 코드가 생성되었습니다.</p>
          <p style="font-size: 0.875rem; margin-bottom: 0.625rem;">
            아래 <strong style="color: #89D9E9;">‘인증 코드’</strong> 복사하여, 인증 코드를 입력하여 이메일 인증을 완료해주세요.
          </p>
          <p style="font-size: 0.875rem; margin-bottom: 0;">감사합니다.</p>
        </div>

        <!-- 인증 코드 섹션 -->
        <div style="margin-top: 3.75rem; font-size: 1rem; font-weight: bold;">인증 코드</div>

        <!-- 인증 코드 박스 -->
        <div
          style="
            margin-top: 1.25rem;
            display: inline-block;
            text-align: center;
            width: 100%;
            height: 3.125rem;
            max-width: 8rem;
            background-color: #89D9E9;
            font-size: 1rem;
            border-radius: 0.5rem;
            color: #404040;
            line-height: 3.125rem;
            font-weight: bold;
            cursor: pointer;
          "
        >
          ${verificationCode}
        </div>
      </div>
    </body>
  </html>`;
}