"use client";

import Image from "next/image";
import ErrorIcon from "@/public/icons/Error_triangle.svg"; 

export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white text-center">
            <Image src={ErrorIcon} alt="에러 아이콘" width={100} height={100} />
            <br />
            <h1 className="text-3xl font-bold">404 ERROR</h1>
            <br />
            <h3 className="text-xl">페이지를 찾을 수 없습니다.</h3>
            <h3 className="text-xl">이용에 불편을 드려 죄송합니다.</h3>
        </div>
    );
}
