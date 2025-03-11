"use client";

import { Button } from "@/components/common";
import { useCallback, useEffect, useState } from "react";
import RenderTitleItem from "./_components/renderTitleItem";
import { useUserStore } from "@/utils/stores/userStore";

export default function TitlePage(){
    const [titles, setTitles] = useState([]);
    const [page, setPage] = useState(1);

    const { id } = useUserStore();

    const getTitle = useCallback(async (page: number) => {
        try {
            const res = await fetch(`/api/title?page=${page}`, {
                headers: {
                    "user-id": id?.toString() || "",                 
                }
            });
            const data = await res.json();
            setTitles(data);
        }
        catch (error) {
            console.log(error);
        }
    }, [id]);

    const gridItems = Array.from({ length: 9 }, (_, index) => titles[index] || { name: "잠금", titleId: "df" });

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (titles.length && titles.length % 9 === 0) {
            setPage(page + 1);
        }    
    };
    
    useEffect(() => {
        getTitle(page);
    }, [page, getTitle]);

    return (
        <div className="bg-slate-400 flex items-center justify-center p-5 flex-1">
            <div className="bg-white p-8 h-screen w-full overflow-hidden">
                <h1 className="mb-20 text-2xl">칭호 도감</h1>
                <div className="grid grid-cols-3 gap-5">
                    {gridItems.map((title, index) => (
                        <RenderTitleItem key={index} title={title} index={index} />
                    ))}                
                </div>
                <div className="flex justify-between items-center mt-10">
                    <Button size="XS" onClick={handlePreviousPage}>{"<<"}</Button>
                    <p>{page}</p>
                    <Button size="XS" onClick={handleNextPage}>{">>"}</Button>  
                </div> 
            </div>
        </div>
    )
}