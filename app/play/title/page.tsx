"use client";

import { Button } from "@/components/common";
import { useEffect, useState } from "react";
import RenderTitleItem from "./_components/renderTitleItem";

export default function TitlePage(){
    const [titles, setTitles] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(9);
    const [totalTitles, setTotalTitles] = useState(0);


    const getTitle = async (page: number, pageSize: number) => {
        try {
            const res = await fetch(`/api/title?page=${page}&page-size=${pageSize}`, {
                headers: {
                    "user-id": "1",
                }
            });
            const data = await res.json();
            setTitles(data);
            setTotalTitles(data.length);
            console.log("data.length", data.length);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTitle(page, pageSize);
    }, [page]);

    const gridItems = Array.from({ length: 9 }, (_, index) => titles[index] || { name: "잠금", titleId: "df" });

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (totalTitles === 9) {
            setPage(page + 1);
        }    
    };


    return (
        <div className="bg-slate-400 h-screen flex items-center justify-center">
            <div className="bg-white h-full w-full p-8 pt-17">
                <h1 className="mb-20 text-2xl">칭호 도감</h1>
                <div className="grid grid-cols-3 gap-5">
                    {gridItems.map((title, index) => (
                        <RenderTitleItem key={index} title={title} index={index} />
                    ))}                
                </div>
                <div className="flex justify-between items-center mt-10">
                    <Button size="XS" onClick={handlePreviousPage}>{"<<"}</Button>
                    <Button size="XS" onClick={handleNextPage}>{">>"}</Button>  
                </div> 
            </div>
        </div>
    )
}