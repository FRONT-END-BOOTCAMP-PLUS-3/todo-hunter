"use client";

import FindIdForm from "@/components/auth/FindIdForm";
import FindIdView from "@/components/auth/FindIdView";
import { useState } from "react";

const FindId = () => {
    const [loginId, setLoginId] = useState<string |  null>(null);
    const [error, setError] = useState<string |  null>(null);

    const handleFindId = (id: string) => {
        setLoginId(id);
        setError(null);
    };

    const handleError = (error: string) => {
        setError(error);
        setLoginId(null);
    };

    const handleBack = () => {
        setLoginId(null);
        setError(null);
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
                    <span>아이디 찾기</span>
                </h1>
                {loginId || error ? <FindIdView loginId={loginId} error={error} onBack={handleBack} /> : <FindIdForm onFindId={handleFindId} onError={handleError} />}
        </div>
    );
}

export default FindId;