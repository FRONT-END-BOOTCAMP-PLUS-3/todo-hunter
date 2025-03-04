"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function TitlePage(){
    const [titles, setTitles] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(9); // 페이지 크기 설정




    const getTitle = async (page: number, pageSize: number) => {
        try {
            const res = await fetch(`/api/title?page=${page}&page-size=${pageSize}`, {
                headers: {
                    "user-id": "1"
                }
            });
            const data = await res.json();
            setTitles(data);
            console.log("data", data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // getTitle(page, pageSize);
    }, [page, pageSize]);

    // 3x3 그리드를 유지하기 위해 빈 칸을 추가
    const gridItems = [...titles];
    while (gridItems.length < 9) {
        gridItems.push({ name: "잠금", titleId: "df" });
    }

    const renderTitleItem = (title, index) => {
        const imageUrl = title.titleId ? `/titles/title_${title.titleId}.png` : "/titles/title_df.png";
        return (
            <div key={index} className="items-center justify-center text-center mb-10">
                <Image src={imageUrl} alt="칭호이미지" width={100} height={100} />
                <p>{title.name}</p>
            </div>
        );
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    return (
        // TODO: 올리기 전에 p-10 지우기
        <div className="bg-slate-400 p-10 h-screen flex items-center justify-center">
            <div className="bg-white h-full w-full p-8 pt-17">
                <h1 className="mb-20 text-2xl">칭호 도감</h1>
                <div className="grid grid-cols-3 gap-5">
                    {gridItems.map(renderTitleItem)}
                </div>
                <div className="flex justify-between mt-10">
                    <button onClick={handlePreviousPage} className="px-4 py-2 is-rounded">{'<<'}</button>
                    <button onClick={handleNextPage} className="px-4 py-2 is-rounded">{'>>'}</button>
                </div>
            </div>
        </div>
    )
}