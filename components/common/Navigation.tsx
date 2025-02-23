"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import "@hackernoon/pixel-icon-library/fonts/iconfont.css";

// <Navigation selectedMenu="선택된 메뉴명" />으로 사용

// 메뉴 정보 배열
const menus = [
    { menu: "character", icon: "user", label: "캐릭터" },
    { menu: "quest", icon: "receipt", label: "퀘스트" },
    { menu: "something", icon: "face-thinking", label: "무언가" }, // 중앙 버튼
    { menu: "titlebook", icon: "trophy", label: "칭호도감" },
    { menu: "ending", icon: "octagon-check", label: "엔딩" },
];

const Navigation = ({selectedMenu="character"}:{selectedMenu?:string}) => {
    const router = useRouter();

    const handleTabChange = (value: string) => {
        router.push(`/${value}`); // URL 해시 변경
    };

    return (
        <Tabs defaultValue={selectedMenu} onValueChange={handleTabChange} className="w-[390px]">
            <TabsList className="w-full h-full flex relative justify-between">
                {/* 왼쪽 그룹 */}
                <div className="flex left">
                    {menus.slice(0, 2).map(({ menu, icon, label }) => (
                    <TabsTrigger key={menu} className="flex flex-col pt-3 pb-2" value={menu}>
                        <div className="icon flex items-start justify-center w-12 h-8">
                            <i className={`hn ${selectedMenu === menu ? `hn-${icon}-solid` : `hn-${icon}`} text-[24px]`}></i>
                        </div>
                        <span className="pt-1">{label}</span>
                    </TabsTrigger>
                    ))}
                </div>
                {/* 중앙 (something) */}
                {menus.filter(({ menu }) => menu === "something")
                    .map(({ menu, icon, label }) => (
                <TabsTrigger
                    key={menu}
                    className={`flex flex-col absolute left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full items-center justify-center
                    ${selectedMenu === menu ? "bg-white" : "bg-zinc-900 text-white"}`}
                    value={menu}
                >
                    <div className="icon flex items-start justify-center w-12 h-9">
                        <i className={`hn ${selectedMenu === menu ? `hn-${icon}-solid` : `hn-${icon}`} text-[26px]`}></i>
                    </div>
                    <span className="text-[16px]">{label}</span>
                </TabsTrigger>
                ))}
                {/* 오른쪽 그룹 */}
                <div className="flex right">
                    {menus.slice(3, 5).map(({ menu, icon, label }) => (
                    <TabsTrigger key={menu} className="flex flex-col pt-3 pb-2" value={menu}>
                        <div className="icon flex items-start justify-center w-12 h-8">
                            <i className={`hn ${selectedMenu === menu ? `hn-${icon}-solid` : `hn-${icon}`} text-[24px]`}></i>
                        </div>
                        <span className="pt-1">{label}</span>
                    </TabsTrigger>
                    ))}
                </div>
            </TabsList>
        </Tabs>
    )
}

export default Navigation;