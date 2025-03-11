"use client";

import { LoginError } from "@/application/usecases/auth/errors/LoginError";
import { Button, Input } from "@/components/common";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const SignUp = () => {
  // React Router 호출
  const router = useRouter();


  /* 로그인 ID 중복확인 시작 */
  const loginIdRef = useRef<HTMLInputElement>(null);
  const [loginIdExists, setLoginIdExists] = useState(null);
  const [loginIdInvalid, setLoginIdInvalid] = useState<boolean>(false); // 로그인 아이디 유효성 검사 후 useState로 boolean값 저장
  const [loginIdEmpty, setLoginIdEmpty] = useState<boolean>(false); // 로그인 아이디 기입 여부 useState로 boolean값 저장
  const [showLoginIdCheckMessage, setShowLoginIdCheckMessage] = useState<boolean>(false);

  const handleCheckExistLoginId = async () => {
    const loginId = loginIdRef.current?.value;
    if (!loginId) {
      setLoginIdEmpty(true);
      setLoginIdInvalid(false);
      setLoginIdExists(null);
      return;
    } else {
      setLoginIdEmpty(false);
    }

    // Validate login ID format
    const loginIdRegex = /^[a-zA-Z0-9_]+$/;
    if (!loginIdRegex.test(loginId)) {
      setLoginIdInvalid(true);
      setLoginIdExists(null);
      return;
    } else {
      setLoginIdInvalid(false);
    }

    try {
      const response = await fetch('/api/auth/check-exist-login-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const isExist = await response.json();
      setLoginIdExists(isExist); // 로그인 ID 유무 체크
      setShowLoginIdCheckMessage(false); // 중복확인 성공 시 메시지 숨김
    } catch (error) {
      if (error instanceof LoginError) {
        alert(error.message);
      } else {
        console.error("Error fetching login ID:", error);
      }
    }
  }
  /* 로그인 ID 중복확인 끝 */


  // 이메일 기입여부 확인  
  const [emailEmpty, setEmailEmpty] = useState<boolean>(false);

  /* 이메일 중복확인 시작 */
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailExists, setEmailExists] = useState(null);
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false); // 이메일이 유효한 형식인지 확인 후 useState로 저장
  const [showEmailCheckMessage, setShowEmailCheckMessage] = useState<boolean>(false); // 추가: 중복확인 필요 메시지 표시 여부

  const handleCheckExistEmail = async () => {
    const email = emailRef.current?.value;
    if (!email) {
      setEmailEmpty(true);
      setEmailInvalid(false);
      setEmailExists(null);
      setShowEmailCheckMessage(false); // 공란 시 메시지 초기화
      return;
    } else {
      setEmailEmpty(false);
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailInvalid(true);
      setEmailExists(null);
      setShowEmailCheckMessage(false);
      return;
    } else {
      setEmailInvalid(false);
    }

    try {
      const response = await fetch('/api/auth/check-exist-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const isExist = await response.json();
      setEmailExists(isExist); // 로그인 ID 유무 체크
      setShowEmailCheckMessage(false);
      setIsCodeSent(false); // 중복확인 재시도 시 인증 발송 상태 초기화
      setIsVerified(null); // 인증 상태 초기화
      setVerificationCodeEmpty(false); // 인증 코드 공란 상태 초기화
    } catch (error) {
      if (error instanceof LoginError) {
        alert(error.message);
      } else {
        console.error("Error fetching login ID:", error);
      }
    }
  }
  /* 이메일 중복확인 끝 */


  /* 이메일 인증 시작 */
  const verificationCodeRef = useRef<HTMLInputElement>(null);
  const [verificationCodeEmpty, setVerificationCodeEmpty] = useState<boolean>(false); // 인증 코드 공란 상태
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const handleSendVerificationCode = async () => {
    const email = emailRef.current?.value;
    if (!email) {
      setEmailEmpty(true);
      setEmailInvalid(false);
      setEmailExists(null);
      setShowEmailCheckMessage(false); // 빈 입력 시 메시지 숨김 (제거필요)
      return;
    } else {
      setEmailEmpty(false);
    }

    // 중복확인 여부를 최우선으로 체크
    if (emailExists === null) {
      setShowEmailCheckMessage(true); // 발송하기 버튼 클릭 시 중복확인 필요 메시지 표시
      setEmailInvalid(false); // 형식 오류 메시지 방지
      return;
    }

    // 중복확인 완료 후 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailInvalid(true);
      setEmailExists(null);
      setShowEmailCheckMessage(false); // 형식 오류 시 중복확인 메시지 숨김
      return;
    } else {
      setEmailInvalid(false);
    }

    if (emailExists) {
      setShowEmailCheckMessage(false);
      return; // 이미 가입된 이메일이면 발송하지 않음
    }

    try {
      const response = await fetch('/api/auth/send-signup-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setIsCodeSent(true);
      setIsVerified(null); // Reset verification status
      setShowEmailCheckMessage(false); // 발송 성공 시 메시지 숨김
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCodeEmpty(!e.target.value); // 공란 여부 업데이트
  };

  const [showVerificationMessage, setShowVerificationMessage] = useState<boolean>(false);

  const handleVerifyCode = async () => {
    const email = emailRef.current?.value;
    const verificationCode = verificationCodeRef.current?.value;

    if (!email || !verificationCode) {
      if (!email) setEmailEmpty(true);
      if (!verificationCode) setVerificationCodeEmpty(true);
      return;
    }
    setVerificationCodeEmpty(false); // 입력 시 공란 상태 해제

    try {
      const response = await fetch('/api/auth/check-verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (response.status === 400) {
        setIsVerified(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setIsVerified(result.isVerified);
      if (result.isVerified) {
        setShowVerificationMessage(false); // 인증 성공 시 메시지 숨김
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setIsVerified(false);
    }
  };
  /* 이메일 인증 끝 */


  /* 비밀번호 일치 확인 시작 */
  const passwordRef = useRef<HTMLInputElement>(null); // 비밀번호 ref 추가
  const confirmPasswordRef = useRef<HTMLInputElement>(null); // 비밀번호 재입력 ref 추가
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false); // 비밀번호 공란 상태
  const [confirmPasswordEmpty, setConfirmPasswordEmpty] = useState<boolean>(false); // 비밀번호 재입력 공란 상태

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordEmpty(!value); // 공란 여부 업데이트
    checkPasswordsMatch(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordEmpty(!value); // 공란 여부 업데이트
    checkPasswordsMatch(password, value);
  };

  const checkPasswordsMatch = (password: string, confirmPassword: string) => {
    if (password === "" || confirmPassword === "") {
      setPasswordsMatch(null);
    } else {
      setPasswordsMatch(password === confirmPassword);
    }
  };
  /* 비밀번호 일치 확인 끝 */
  

  /* submit 시 닉네임 및 이메일 공란일 경우 설정 시작 */
  const nicknameRef = useRef<HTMLInputElement>(null); // 닉네임 ref 추가
  const [nicknameEmpty, setNicknameEmpty] = useState<boolean>(false); // 닉네임 공란 상태
  /* submit 시 닉네임 및 이메일 공란일 경우 설정 끝 */


  // Input 값 비울 경우 하단 표시 메시지 초기화 (통합 관리)
  const handleLoginIdChange = () => {
    setLoginIdExists(null);
    setLoginIdEmpty(false); // 공란 상태 초기화
    setShowLoginIdCheckMessage(false); // 입력값 변경 시 메시지 초기화
  }

  const handleEmailChange = () => {
    setEmailExists(null);
    setEmailInvalid(false);
    setShowEmailCheckMessage(false); // 입력값 변경 시 메시지 초기화
    setEmailEmpty(false); // 공란 상태 초기화
    setIsCodeSent(false); // 인증 발송 상태 초기화
    setIsVerified(null); // 인증 상태 초기화
    setShowVerificationMessage(false); // 인증 메시지 초기화
    setVerificationCodeEmpty(false); // 인증 코드 공란 상태 초기화
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameEmpty(!e.target.value); // 공란 여부 업데이트
  };
  /* submit 시 닉네임 및 이메일 공란일 경우 설정 끝 */


  /* 가입 시작 */
  const handleSignUp = async () => {
    const loginId = loginIdRef.current?.value;
    const email = emailRef.current?.value;
    const nickname = nicknameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPasswordValue = confirmPasswordRef.current?.value;
    const verificationCode = verificationCodeRef.current?.value;
  
    // 모든 입력값 및 중복확인 상태 검증
    setLoginIdEmpty(!loginId);
    setEmailEmpty(!email);
    setNicknameEmpty(!nickname);
    setPasswordEmpty(!password);
    setConfirmPasswordEmpty(!confirmPasswordValue);
    setVerificationCodeEmpty(isCodeSent && !verificationCode);

    // 중복확인 여부 체크
    const isLoginIdCheckNeeded = loginId && loginIdExists === null;
    const isEmailCheckNeeded = email && emailExists === null; // 중복확인 필요 여부만 체크

    setShowLoginIdCheckMessage(!!isLoginIdCheckNeeded);
    setShowEmailCheckMessage(!!isEmailCheckNeeded);

    // 인증번호 발송 및 인증 완료 여부 체크
    if (isEmailCheckNeeded) {
      return; // 이메일 중복확인 필요 시 중단
    }
    if (!isCodeSent) {
      setShowVerificationMessage(true); // 인증번호 발송이 필요함을 알림
      setShowEmailCheckMessage(false); // 중복확인 메시지 숨김
      return;
    }
    if (isCodeSent && !isVerified) {
      setShowVerificationMessage(true); // 인증 필요 메시지 표시
      setShowEmailCheckMessage(false); // 중복확인 메시지 숨김
      return;
    } else {
      setShowVerificationMessage(false); // 인증 완료 시 메시지 숨김
    }
  
    // 모든 입력값과 조건을 한 번에 체크
    if (
      !loginId || !email || !nickname || !password || !confirmPasswordValue ||
      (isCodeSent && !verificationCode) || // 입력값 공란 체크
      loginIdInvalid || emailInvalid || !passwordsMatch ||
      emailExists || loginIdExists || // 유효성 및 중복 체크
      isLoginIdCheckNeeded
    ) {
      return; // 하나라도 실패하면 submit하지 않음
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, email, nickname, password }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // const data = await response.json(); // 회원가입 정보 클라이언트 측에 로그로 표시
      // console.log(data); // 회원가입 정보 클라이언트 측에 로그로 표시
    } catch (error) {
      console.error("Error signing up:", error);
    }

    alert("가입이 완료되었습니다!");

    // // 가입 성공 시 로그인 페이지로 이동
    // router.push("/signin");

    // 가입 성공 시 인게임 페이지로 이동
    router.push("/play/character");
  };
  /* 가입 끝 */
  

  return (
    <div className={
        `
        flex
            flex-col
            justify-center
            items-center
        mx-3
        min-h-screen
        `
        .replace(/\s+/g, ' ').trim()
        }>
        <h1 className={
        `
        mb-[40px]
        text-center
        text-[38px]
        `
        .replace(/\s+/g, ' ').trim()
        }>
            <span>회원가입</span>
        </h1>
        <div className="row relative w-full flex flex-col">
            <div className={`
                w-full
                flex
                    items-center
                    gap-2
                `
                .replace(/\s+/g, ' ').trim()
            }>
                <Input placeholder="아이디" className="is-rounded-form w-full shadow-none"
                  ref={loginIdRef} onChange={handleLoginIdChange} />
                <Button style={{padding: "4px 16px",marginRight: 0}}
                  onClick={handleCheckExistLoginId}>중복확인</Button>
            </div>
            {(loginIdEmpty
              || loginIdInvalid
              || loginIdExists !== null
              || showLoginIdCheckMessage
            ) && (
            <span className={
              `
              absolute
              ${loginIdEmpty || loginIdInvalid || loginIdExists || showLoginIdCheckMessage ?
                "text-[#A72F35]" : "text-[#2FA770]"}
              -bottom-[22px]
              `
              .replace(/\s+/g, ' ').trim()}>
                {loginIdEmpty ? "아이디를 입력해주세요." :
                showLoginIdCheckMessage ? "아이디 중복확인이 필요합니다." :
                loginIdInvalid ? "올바르지 않은 아이디 형식입니다." :
                loginIdExists ? "가입된 아이디가 존재합니다." : "사용 가능한 아이디입니다."}
            </span>
            )}
        </div>
        <div className="row relative w-full flex flex-col mt-[26px]">
            <Input placeholder="닉네임" className="is-rounded-form w-full shadow-none"
              ref={nicknameRef} onChange={handleNicknameChange} />
            {nicknameEmpty && (
            <span className={
                `
                absolute
                text-[#A72F35]
                -bottom-[26px]
                `
                .replace(/\s+/g, ' ').trim()
            }>
                닉네임을 입력해 주세요.
            </span>
            )}
        </div>
        <div className="row relative w-full flex flex-col mt-[26px]">
            <div className={`
                w-full
                flex
                    items-center
                    gap-2
                `
                .replace(/\s+/g, ' ').trim()
            }>
                <Input
                  placeholder="이메일"
                  className={
                    `
                    is-rounded-form
                    w-full
                    ${isCodeSent && "text-muted-foreground"}
                    shadow-none
                  `}
                  type="email"
                  ref={emailRef}
                  onChange={handleEmailChange}
                  readOnly={isCodeSent} />
                <Button style={{padding: "4px 16px",marginRight: 0}} onClick={handleCheckExistEmail}>중복확인</Button>
            </div>
            {(emailEmpty
              || showEmailCheckMessage
              || emailInvalid
              || (emailExists !== null)
              || showVerificationMessage
            ) && (
            <span className={
                `
                absolute
                ${emailEmpty || showEmailCheckMessage || emailInvalid || emailExists || showVerificationMessage ?
                  "text-[#A72F35]" : "text-[#2FA770]"}
                -bottom-[22px]
                `
                .replace(/\s+/g, ' ').trim()
              }>
                {
                emailEmpty
                ? "이메일을 입력하세요."
                : showVerificationMessage && !isCodeSent
                ? "인증번호 발송이 필요합니다."
                : showVerificationMessage
                ? "인증코드 인증이 필요합니다."
                : showEmailCheckMessage
                ? "이메일 중복확인이 필요합니다."
                : emailInvalid
                ? "올바르지 않은 이메일 형식입니다."
                : emailExists
                ? "가입된 이메일입니다."
                : "사용 가능한 이메일입니다."
                }
            </span>
            )}
        </div>
        <div className="row relative w-full flex flex-col mt-[26px]">
            <Input placeholder="비밀번호" className="is-rounded-form w-full shadow-none" type="password"
              ref={passwordRef} value={password} onChange={handlePasswordChange} />
            {passwordEmpty && (
            <span className={
                `
                absolute
                text-[#A72F35]
                -bottom-[26px]
                `
                .replace(/\s+/g, ' ').trim()
            }>
                비밀번호를 입력해 주세요.
            </span>
            )}
        </div>
        <div className="row relative w-full flex mt-[30px]">
            <Input placeholder="비밀번호 재입력" className="is-rounded-form w-full shadow-none" type="password"
              ref={confirmPasswordRef} value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {(confirmPasswordEmpty || passwordsMatch !== null) && (
                <span className={
                    `absolute
                    ${confirmPasswordEmpty || !passwordsMatch ?
                      "text-[#A72F35]" : "text-[#2FA770]"}
                    -bottom-[26px]`
                    .replace(/\s+/g, ' ').trim()
                }>
                    {confirmPasswordEmpty ? "비밀번호를 상기 기재란에도 입력해주세요." :
                    passwordsMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
                </span>
            )}
        </div>
        <div className={
            `
            row
            relative
            w-full
            flex
              flex-col
            ${isVerified ? "mt-[30px]" : "mt-[26px]"}
            `
            .replace(/\s+/g, ' ').trim()
          }>
            <div className={`
                w-full
                flex
                    items-center
                    gap-2
                `
                .replace(/\s+/g, ' ').trim()
            }>
                <Input
                    placeholder={isCodeSent ? "인증코드" : "인증번호 발송"}
                    className={
                      `
                      is-rounded-form
                      w-full
                      shadow-none
                      ${isCodeSent && isVerified ? "text-muted-foreground" : ""}
                      `
                      .replace(/\s+/g, ' ').trim()
                    }
                    ref={isCodeSent ? verificationCodeRef : null}
                    readOnly={isCodeSent && !!isVerified}
                    onChange={handleVerificationCodeChange}
                />
                {/* isCodeSent가 true이고 isVerified가 false일 때만 버튼 표시 */}
                {isCodeSent && !isVerified && (
                  <Button
                    style={{ padding: "4px 16px", marginRight: 0 }}
                    onClick={handleSendVerificationCode}
                  >
                    재전송
                  </Button>
                )}
                {isCodeSent && !isVerified && (
                  <Button
                    style={{ padding: "4px 16px", marginRight: 0 }}
                    onClick={handleVerifyCode}
                  >
                    인증하기
                  </Button>
                )}
                {!isCodeSent && (
                  <Button
                    style={{ padding: "4px 16px", marginRight: 0 }}
                    onClick={handleSendVerificationCode}
                  >
                    발송하기
                  </Button>
                )}
            </div>
            {isCodeSent && (
            <span
              className={
                `
                absolute
                ${verificationCodeEmpty || showVerificationMessage ||
                  isVerified === false ? "text-[#A72F35]"
                  : isVerified === null ? "text-[#2FA770]" : "text-[#2FA770]"}
                ${isVerified ? "-bottom-[26px]" : "-bottom-[22px]"}
                `
                .replace(/\s+/g, " ").trim()
              }
            >
              {verificationCodeEmpty ? "인증코드를 입력해주세요."
              : showVerificationMessage ? "인증코드 인증이 필요합니다."
              : isVerified === null ? "이메일을 발송하였습니다."
              : isVerified ? "인증코드가 일치합니다." : "인증코드가 일치하지 않습니다."}
            </span>
            )}
        </div>
        <div className="row w-full mt-[60px]">
            <Button style={{ width: "100%", marginLeft: 0, marginRight: 0 }} state="success" size="L"
              onClick={handleSignUp}>가입하기</Button>
        </div>
    </div>
  );
};

export default SignUp;