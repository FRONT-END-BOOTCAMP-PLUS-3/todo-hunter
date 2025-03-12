"use client";

import Image from "next/image";
import ErrorIcon from "@/public/icons/Error_triangle.svg"; 
import { Button } from "@/components/common";

export default function GlobalError({ error }: { error: Error; }) {
    console.error("Global Error 발생:", error); 

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white text-center">
            <Image src={ErrorIcon} alt="에러 아이콘" width={100} height={100} />
            <br />
            <h1 className="text-3xl font-bold">500 ERROR</h1>
            <br />
            <h3 className="text-xl">INTERNAL SERVER ERROR</h3>
            <h3 className="text-xl">이용에 불편을 드려 죄송합니다.</h3>
            <Button onClick={() => window.history.back()} className="mt-10" style={{"borderColor":"white"}}>
                <span><i className="hn hn-arrow-alt-circle-left mr-2" style={{"lineHeight":"26px"}}></i>뒤로 가기</span>
            </Button>
        </div>
    );
}
