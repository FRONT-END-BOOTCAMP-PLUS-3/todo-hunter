"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/common/Tabs";
import "@hackernoon/pixel-icon-library/fonts/iconfont.css";
import menus from "@/constants/menu";

// <Navigation selectedMenu="선택된 메뉴명" />으로 사용

const Navigation = ({selectedMenu="character"}:{selectedMenu?:string}) => {
    const router = useRouter();

    const handleTabChange = (value: string) => {
        router.push(`/${value}`); // URL 해시 변경
    };

    return (
        <Tabs defaultValue={selectedMenu} onValueChange={handleTabChange} className="w-full">
            <TabsList className="
                    is-rounded-navi
                    flex
                    relative
                        justify-between
                    h-full
                        max-[300px]:h-[66px]
                    mt-[-2px]
                    mb-[-2px]
                    ml-[4px]
                    mr-[4px]
                ">
                {/* 왼쪽 그룹 */}
                <div className={`
                    flex
                        justify-evenly
                    relative
                    w-full
                    left-[-4px]
                `
                .replace(/\s+/g, ' ').trim()
                }>
                    {menus.slice(0, 2).map(({ menu, icon, label }) => (
                    <TabsTrigger key={menu} className={`
                        is-rounded-navi
                        flex
                            flex-col
                        px-0 pt-2 pb-1
                        max-[430px]:min-w-[40px]
                        h-[60px] max-[300px]:h-[56px]
                            min-[430px]:pl-4
                            min-[430px]:pr-4
                        ${selectedMenu === menu ? `pt-1 pb-0` : `pb-1`}
                    `
                    .replace(/\s+/g, ' ').trim()
                    } value={menu}>
                        <div className={`
                            icon
                            flex
                                justify-center
                                items-start
                            h-8
                                max-[300px]:h-7
                            min-[430px]:pb-2
                        `
                        .replace(/\s+/g, ' ').trim()
                        }>
                        <i className={`
                            hn ${selectedMenu === menu ? `hn-${icon}-solid` : `hn-${icon}`}
                            text-[24px]
                        `
                        .replace(/\s+/g, ' ').trim()
                        }></i>
                        </div>
                        <span className={`
                            pt-1
                            text-xs
                                min-[430px]:text-sm
                        `
                        .replace(/\s+/g, ' ').trim()
                        }>
                            {(Array.isArray(label) ? label : [label]).map((text, brIndex) => (
                                <React.Fragment key={brIndex}>
                                    {text}
                                    {brIndex !== (Array.isArray(label) ? label.length - 1 : 0) &&
                                        <br className="hidden max-[430px]:block" />}
                                </React.Fragment>
                            ))}
                        </span>
                    </TabsTrigger>
                    ))}
                </div>
                {/* 중앙 (something) */}
                <div className={`
                    flex
                    relative
                    min-w-[100px]
                        max-[430px]:min-w-[80px]
                        max-[300px]:min-w-[70px]
                `
                .replace(/\s+/g, ' ').trim()}>
                {menus[2] && (
                <TabsTrigger
                    key={menus[2].menu}
                    className={`
                        is-rounded-full
                        flex
                            flex-col
                            justify-center
                            items-center
                        absolute
                            left-1/2
                            -translate-x-1/2
                            -translate-y-1/2
                        min-w-[100px]
                            max-[430px]:min-w-[90px]
                            max-[300px]:w-[80px]
                        h-[100px]
                            max-[300px]:h-[80px]
                        max-[430px]:pt-3
                        border-transparent
                    ${selectedMenu === menus[2].menu ? "bg-white" : "transparent text-white"}
                    text-lg sm:text-base`
                    .replace(/\s+/g, ' ').trim()}
                    value={menus[2].menu}
                >
                    <div className={`
                        icon
                        flex
                            justify-center
                            items-start
                        h-9
                            max-[430px]:h-7
                    `
                    .replace(/\s+/g, ' ').trim()
                    }>
                        <i className={`hn ${selectedMenu === menus[2].menu ? `hn-${menus[2].icon}-solid` : `hn-${menus[2].icon}`} text-[26px] min-[430px]:text-[30px]`}></i>
                    </div>
                    <span className="text-[16px] max-[430px]:text-[14px]">{menus[2].label}</span>
                </TabsTrigger>
                )}
                </div>
                {/* 오른쪽 그룹 */}
                <div className={`
                    flex
                        justify-evenly
                    relative
                    w-full
                    right-[-4px]
                `
                .replace(/\s+/g, ' ').trim()
                }>
                    {menus.slice(3, 5).map(({ menu, icon, label }) => (
                    <TabsTrigger key={menu} className={`
                        is-rounded-navi
                        flex
                            flex-col
                        px-0 pt-2 pb-1
                        max-[430px]:min-w-[40px]
                        h-[60px] max-[300px]:h-[56px]
                            min-[430px]:pl-4
                            min-[430px]:pr-4
                        ${selectedMenu === menu ? `pt-1 pb-0` : `pb-1`}
                    `
                    .replace(/\s+/g, ' ').trim()
                    } value={menu}>
                        <div className={`
                            icon
                            flex
                                justify-center
                                items-start
                            h-8
                                max-[300px]:h-7
                            min-[430px]:pb-2
                        `
                        .replace(/\s+/g, ' ').trim()
                        }>
                        <i className={`
                            hn ${selectedMenu === menu ? `hn-${icon}-solid` : `hn-${icon}`}
                            text-[24px]
                        `
                        .replace(/\s+/g, ' ').trim()
                        }></i>
                        </div>
                        <span className={`
                            pt-1
                            text-xs
                                min-[430px]:text-sm
                            `
                            .replace(/\s+/g, ' ').trim()
                            }>
                            {(Array.isArray(label) ? label : [label]).map((text, brIndex) => (
                                <React.Fragment key={brIndex}>
                                    {text}
                                    {brIndex !== (Array.isArray(label) ? label.length - 1 : 0) &&
                                        <br className="hidden max-[430px]:block" />}
                                </React.Fragment>
                            ))}
                        </span>
                    </TabsTrigger>
                    ))}
                </div>
            </TabsList>
        </Tabs>
    )
}

export default Navigation;