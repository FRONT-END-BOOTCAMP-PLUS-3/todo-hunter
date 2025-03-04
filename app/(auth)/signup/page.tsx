"use client";

import { LoginError } from "@/application/usecases/auth/errors/LoginError";
import { Button, Input } from "@/components/common";
import { useRef, useState } from "react";

const SignUp = () => {
  /* 로그인 ID 중복확인 시작 */
  const loginIdRef = useRef<HTMLInputElement>(null);
  const [loginIdExists, setLoginIdExists] = useState(null);
  const [loginIdInvalid, setLoginIdInvalid] = useState<boolean>(false); // State to track invalid login ID format

  const handleCheckExistLoginId = async () => {
    const loginId = loginIdRef.current?.value;
    if (!loginId) {
      alert("아이디를 입력하세요.");
      return;
    }

    // Validate login ID format
    const loginIdRegex = /^[a-zA-Z0-9]+$/;
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const isExist = await response.json();
      setLoginIdExists(isExist); // 로그인 ID 유무 체크
    } catch (error) {
      if (error instanceof LoginError) {
        alert(error.message);
      } else {
        console.error("Error fetching login ID:", error);
      }
    }
  }
  /* 로그인 ID 중복확인 끝 */

  /* 이메일 중복확인 시작 */
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailExists, setEmailExists] = useState(null);
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false); // State to track invalid email format

  const handleCheckExistEmail = async () => {
    const email = emailRef.current?.value;
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailInvalid(true);
      setEmailExists(null);
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
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const handleSendVerificationCode = async () => {
    const email = emailRef.current?.value;
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
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

      alert("인증번호가 발송되었습니다.");
      setIsCodeSent(true);
      setIsVerified(null); // Reset verification status
      setVerificationMessage("이메일을 발송하였습니다.");
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const handleVerifyCode = async () => {
    const email = emailRef.current?.value;
    const code = verificationCodeRef.current?.value;

    if (!email || !code) {
      alert("이메일과 인증코드를 입력하세요.");
      return;
    }

    try {
      const response = await fetch('/api/auth/check-verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
    //   setVerificationMessage(result.message);
      if (result.isVerified) {
        setVerificationMessage("인증코드가 일치합니다.");
        setIsVerified(true);
      } else {
        setVerificationMessage("인증코드가 일치하지 않습니다.");
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setVerificationMessage("인증코드가 일치하지 않습니다.");
      setIsVerified(false);
    }
  };
  /* 이메일 인증 끝 */

  // 비밀번호 일치 확인
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    checkPasswordsMatch(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    checkPasswordsMatch(password, e.target.value);
  };

  const checkPasswordsMatch = (password: string, confirmPassword: string) => {
    if (password === "" || confirmPassword === "") {
      setPasswordsMatch(null);
    } else {
      setPasswordsMatch(password === confirmPassword);
    }
  };
  
  // Input 값 비울 경우 하단 표시 메시지 초기화 (통합 관리)
  const handleInputChange = () => {
    //로그인
    setLoginIdExists(null);
    //이메일
    setEmailExists(null);
    setEmailInvalid(false);
  }
  
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
                <Input placeholder="아이디" className="is-rounded-form w-full shadow-none" ref={loginIdRef} onChange={handleInputChange} />
                <Button style={{padding: "4px 16px",marginRight: 0}} onClick={handleCheckExistLoginId}>중복확인</Button>
            </div>
            {(loginIdInvalid || loginIdExists !== null) && (
            <span className={
                `
                absolute
                ${loginIdInvalid ? "text-[#A72F35]" : loginIdExists ? "text-[#A72F35]" : "text-[#2FA770]" }
                -bottom-[22px]
                `
                .replace(/\s+/g, ' ').trim()
                }>
                {loginIdInvalid ? "올바르지 않은 아이디 형식입니다." : loginIdExists ? "가입된 아이디가 존재합니다." : "사용 가능한 아이디입니다."}
            </span>
            )}
        </div>
        <div className="row w-full mt-[26px]">
            <Input placeholder="닉네임" className="is-rounded-form w-full shadow-none" />
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
                <Input placeholder="이메일" className="is-rounded-form w-full shadow-none" type="email" ref={emailRef} onChange={handleInputChange} />
                <Button style={{padding: "4px 16px",marginRight: 0}} onClick={handleCheckExistEmail}>중복확인</Button>
            </div>
            {(emailInvalid || emailExists !== null) && (
                <span className={
                    `
                    absolute
                    ${emailInvalid ? "text-[#A72F35]" : emailExists ? "text-[#A72F35]" : "text-[#2FA770]" }
                    -bottom-[22px]
                    `
                    .replace(/\s+/g, ' ').trim()
                }>
                    {emailInvalid ? "올바르지 않은 이메일 형식입니다." : emailExists ? "가입된 이메일입니다." : "사용 가능한 이메일입니다."}
                </span>
            )}
        </div>
        <div className="row w-full mt-[26px]">
            <Input placeholder="비밀번호" className="is-rounded-form w-full shadow-none" type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div className="row relative w-full flex mt-[30px]">
            <Input placeholder="비밀번호 재입력" className="is-rounded-form w-full shadow-none" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {passwordsMatch !== null && (
                <span className={
                    `
                    absolute
                    ${passwordsMatch ? "text-[#2FA770]" : "text-[#A72F35]" }
                    -bottom-[26px]
                    `
                    .replace(/\s+/g, ' ').trim()
                }>
                    {passwordsMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}
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
                    placeholder={isCodeSent ? "인증코드" : "인증번호 발송"}
                    className="is-rounded-form w-full shadow-none"
                    ref={isCodeSent ? verificationCodeRef : null}
                />
                {isCodeSent && (
                    <Button
                    style={{ padding: "4px 16px", marginRight: 0 }}
                    onClick={handleSendVerificationCode}
                    >
                    재전송
                    </Button>
                )}
                <Button
                    style={{ padding: "4px 16px", marginRight: 0 }}
                    onClick={handleSendVerificationCode}
                >
                    {isCodeSent ? "인증하기" : "발송하기"}
                </Button>
            </div>
            {isCodeSent && (
            <span
              className={`
                absolute
                ${isVerified === null ? "text-[#2FA770]" : isVerified ? "text-[#2FA770]" : "text-[#A72F35]"}
                -bottom-[24px]
              `.replace(/\s+/g, " ").trim()}
            >
              {isVerified === null
                ? "이메일을 발송하였습니다."
                : isVerified
                ? "인증코드가 일치합니다."
                : "인증코드가 일치하지 않습니다."}
            </span>
            )}
        </div>
        <div className="row w-full mt-[60px]">
            <Button style={{ width: "100%", marginLeft: 0, marginRight: 0 }} state="success" size="L">가입하기</Button>
        </div>
    </div>
  );
};

export default SignUp;