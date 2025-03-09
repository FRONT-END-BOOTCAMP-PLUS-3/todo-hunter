"use client";

import { Button, Input } from "@/components/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignIn = () => {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId, password }),
      });

      const data = await response.json();
      console.log(data);
      router.push("/play"); // 인게임으로 이동
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };
  
  const handleMove = (value: string) => {
    router.push(`/${value}`); // URL 해시 변경
  };
  
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
        <span>로그인</span>
      </h1>
      <div className="gap-box block w-full mb-2">
        <span className="block mb-2">ID</span>
        <Input className="is-rounded-form w-full shadow-none" type="text"
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)} />
      </div>
      <div className="gap-box block w-full mb-2">
        <span className="block mb-2">PASSWORD</span>
        <Input className="is-rounded-form w-full shadow-none" type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="gap-box mt-8 w-full">
        <Button value={"play"} onClick={handleSignIn} style={{ width: "100%", marginLeft: 0, marginRight: 0 }} state="success" size="L">로그인하기</Button>
        <Button value={"signup"} onClick={(e) => handleMove(e.currentTarget.value)} style={{ width: "100%", marginLeft: 0, marginRight: 0 }} state="warning" size="L">회원가입</Button>
      </div>
      <div className="gap-box text-center mt-12 w-full">
        <Link href="/findid">아이디 찾기 &gt;</Link>
      </div>
      {/* <div className="gap-box text-center mt-2 w-full">
        <Link href="/findpw">비밀번호 찾기 &gt;</Link>
      </div> */}
    </div>
  );
};

export default SignIn;