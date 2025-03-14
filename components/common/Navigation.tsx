"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/common/tabs";
import "@hackernoon/pixel-icon-library/fonts/iconfont.css";
import { MENUS } from "@/constants/menu";
import { useUserStore } from "@/utils/stores/userStore";

interface NavigationProps {
  selectedMenu?: string;
  className?: string;
}

// <Navigation selectedMenu="선택된 메뉴명" className="custom-class" /> 이렇게 사용 가능

const Navigation: React.FC<NavigationProps> = ({
  selectedMenu = "character",
  className = "",
}) => {
  const router = useRouter();
  const endingState = useUserStore((state) => state.endingState);

  const handleTabChange = (value: string) => {
    router.push(`/play/${value}`); // URL 변경
  };

  const isEndingDisabled = (menu: string) => {
    if (menu === "ending") {
      return endingState !== 2;
    }
    return false;
  };

  return (
    <div className={`${className}`}>
      <Tabs
        defaultValue={selectedMenu}
        onValueChange={handleTabChange}
        className={`w-full ${className}`}
      >
        <TabsList
          className="
          is-rounded-navi
          flex
          relative
          justify-between
          h-full
          max-[300px]:h-[66px]
          mt-[-2px] mb-[-2px] ml-[4px] mr-[4px]
      "
        >
          {/* 왼쪽 그룹 */}
          <div className="flex justify-evenly relative w-full left-[-4px]">
            {MENUS.slice(0, 2).map(({ menu, icon, label, disabled }) => (
              <TabsTrigger
                key={menu}
                className={`
                is-rounded-navi flex flex-col px-0 pt-2 pb-1
                max-[430px]:min-w-[40px] h-[60px] max-[300px]:h-[56px]
                min-[430px]:pl-4 min-[430px]:pr-4
                ${selectedMenu === menu ? `pt-1 pb-0` : `pb-1`}
              `}
                value={menu}
                disabled={disabled}
              >
                <div className="icon flex justify-center items-start h-8 max-[300px]:h-7 min-[430px]:pb-2">
                  <i
                    className={`hn ${
                      selectedMenu === menu ? `hn-${icon}-solid` : `hn-${icon}`
                    } text-[24px]`}
                  ></i>
                </div>
                <span className="pt-1 text-xs min-[430px]:text-sm">
                  {(Array.isArray(label) ? label : [label]).map(
                    (text, brIndex) => (
                      <React.Fragment key={brIndex}>
                        {text}
                        {brIndex !==
                          (Array.isArray(label) ? label.length - 1 : 0) && (
                          <br className="hidden max-[430px]:block" />
                        )}
                      </React.Fragment>
                    )
                  )}
                </span>
              </TabsTrigger>
            ))}
          </div>

          {/* 중앙 (something) */}
          <div className="flex relative min-w-[100px] max-[430px]:min-w-[80px] max-[300px]:min-w-[70px]">
            {MENUS[2] && (
              <TabsTrigger
                key={MENUS[2].menu}
                className={`is-rounded-full flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 -translate-y-1/2
                min-w-[100px] max-[430px]:min-w-[90px] max-[300px]:w-[80px]
                h-[100px] max-[300px]:h-[80px] max-[430px]:pt-3 border-transparent
                data-[state=active]:bg-transparent data-[state=active]:text-white
                ${
                  selectedMenu === MENUS[2].menu
                    ? "bg-white"
                    : "transparent text-white"
                } text-lg sm:text-base`}
                value={MENUS[2].menu}
              >
                <div className="icon flex justify-center items-start h-9 max-[430px]:h-7">
                  <i
                    className={`hn ${
                      selectedMenu === MENUS[2].menu
                        ? `hn-${MENUS[2].icon}-solid`
                        : `hn-${MENUS[2].icon}`
                    } text-[26px] min-[430px]:text-[30px]`}
                  ></i>
                </div>
                <span className="text-[16px] max-[430px]:text-[14px]">
                  {MENUS[2].label}
                </span>
              </TabsTrigger>
            )}
          </div>

          {/* 오른쪽 그룹 */}
          <div className="flex justify-evenly relative w-full right-[-4px]">
            {MENUS.slice(3, 5).map(({ menu, icon, label }) => (
              <TabsTrigger
                key={menu}
                className={`
                is-rounded-navi flex flex-col px-0 pt-2 pb-1
                max-[430px]:min-w-[40px] h-[60px] max-[300px]:h-[56px]
                min-[430px]:pl-4 min-[430px]:pr-4
                ${selectedMenu === menu ? `pt-1 pb-0` : `pb-1`}
              `}
                value={menu}
                disabled={isEndingDisabled(menu)}
              >
                <div className="icon flex justify-center items-start h-8 max-[300px]:h-7 min-[430px]:pb-2">
                  <i
                    className={`hn ${
                      selectedMenu === menu ? `hn-${icon}-solid` : `hn-${icon}`
                    } text-[24px]`}
                  ></i>
                </div>
                <span className="pt-1 text-xs min-[430px]:text-sm">
                  {(Array.isArray(label) ? label : [label]).map(
                    (text, brIndex) => (
                      <React.Fragment key={brIndex}>
                        {text}
                        {brIndex !==
                          (Array.isArray(label) ? label.length - 1 : 0) && (
                          <br className="hidden max-[430px]:block" />
                        )}
                      </React.Fragment>
                    )
                  )}
                </span>
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Navigation;
