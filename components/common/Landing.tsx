"use client";

import { Button } from "@/components/common";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleClickStart = () => {
    router.push("/signin");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black">
  <Image src="/images/Logo.png" alt="로고" className="p-6" width={350} height={100}/>
  <Button size="L" state="success" onClick={handleClickStart} className="mt-20">
    시작하기
  </Button>
</div>

  );
}
