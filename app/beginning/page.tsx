"use client";

import React, { useState, useEffect, JSX } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import Image from "next/image";
import { Button } from "@/components/common";

// ReactFullpage를 클라이언트에서만 동적으로 로드
const ReactFullpage = dynamic(() => import("@fullpage/react-fullpage"), {
  ssr: false // 서버 사이드 렌더링 비활성화
});

interface Slide {
  content: JSX.Element;
}

const Beginning = () => {
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 버튼 클릭 시 쿠키를 설정하는 함수
  const handleStartClick = () => {
    document.cookie = "isBeginned=true; path=/; max-age=31536000; SameSite=Lax"; // 쿠키 설정 (1년 유효)
    window.location.href = '/';
  };

  // 슬라이드 데이터 배열
  const slides: Slide[] = [
    {
      content: (
        <>
        <Image className="mb-6" src="/images/beginning/01.png" width={326} height={259} alt="" />
        <span className="text-white text-[24px]">지겨운 할 일,<br />게임처럼 즐길 수 없을까?</span>
        <br />
        <span className="text-white text-[24px]">할 일을 사냥하세요.</span>
        </>
      ),
    },
    {
      content: (
        <>
        <Image className="mb-6" src="/images/beginning/02.png" width={292} height={319} alt="" />
        <span className="text-white text-[24px]">한 주간의 노력을<br />엔딩으로 확인하세요.</span>
        </>
      ),
    },
    {
      content: (
        <>
        <Image className="mb-6" src="/images/beginning/03.png" width={220} height={348} alt="" />
        <span className="text-white text-[24px]">성장하는 내 모습을<br />확인해보세요.</span>
        <Button className="mt-6 text-white" size={"S"} state={"current"} onClick={handleStartClick}>
          TODO START
        </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleMousedown = () => {
      setIsDragging(true);
    };

    const handleMouseup = () => {
      setIsDragging(false); // 애니메이션 지속 시간 후 해제
    };

    window.addEventListener("mousedown", handleMousedown);
    window.addEventListener("mouseup", handleMouseup);

    return () => {
      window.removeEventListener("mousedown", handleMousedown);
      window.removeEventListener("mouseup", handleMouseup);
    };
  }, []);

  // SSR용 초기 콘텐츠
  if (!isClient) {
    return (
      <div className="section text-center">
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <div className="flex flex-col justify-center items-center min-h-screen bg-black">
              {slide.content}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
    {/* 외부 스크립트 로드 */}
    <Script src="/js/fullpage.js@4.0.34/fullpage.extensions.min.js"
      strategy="afterInteractive" // 페이지가 로드된 후에 스크립트를 로드
    />
    <Script src="/js/fullpage.js@4.0.34/fullpage.dragAndMove.min.js"
      strategy="afterInteractive" // 페이지가 로드된 후에 스크립트를 로드
    />
    <ReactFullpage
      licenseKey={"NT1UH-K03K9-KARAH-9X2J9-BNOCM"} // 라이센스 키
      scrollingSpeed={isDragging ? 100 : 200} // 스크롤 속도
      controlArrows={false} // 화살표 숨김
      dragAndMove={"horizontal"} // 마우스 드래그로 슬라이드 이동 활성화
      dragAndMoveKey={"alVkRzlrYnkxb2RXNTBaWEl1WTI5dDBTX2JDcFpISmhaMEZ1WkUxdmRtVT1PQWI="}
      scrollOverflow={false} // dragAndMove 사용 시 false로 설정 (충돌 문제)
      scrollHorizontally={true} // 좌우 슬라이드 이동 활성화
      touchSensitivity={5} // ✨ 터치 감도 증가
      normalScrollElementTouchThreshold={5} // 터치 스크롤 조정
      easingcss3={isDragging ? "linear" : ""} // 🔥 키보드 이동 시 easing 제거
      keyboardScrolling={true} // 화살표 키 이동 활성화
      sectionsColor={["#000"]} // 각 슬라이드 배경색 (선택 사항)
      // anchors={["first", "second", "third"]} // 앵커 이름 설정 (선택 사항)
      menu={"#menu"} // 네비게이션 메뉴 (선택 사항)
      normalScrollElements={"#menu"} // 특정 요소 스크롤 방지
      credits={{ enabled: false }} // 라이센스 관련 크레딧 표시를 비활성화
      slidesNavigation={true} // 슬라이드 네비게이션 활성화
      afterLoad={() => {
        // 슬라이드 로드 후 a 태그 안에 div.slider-bullet과 div.pixel 추가
        const links = document.querySelectorAll(".fp-slidesNav ul li a");
        links.forEach((link) => {
          // 1. div.slider-bullet과 div.pixel 추가
          if (!link.querySelector(".slider-bullet")) {
            const sliderBullet = document.createElement("div");
            sliderBullet.className = "slider-bullet";

            const pixel = document.createElement("div");
            pixel.className = "pixel";

            sliderBullet.appendChild(pixel);
            link.appendChild(sliderBullet);
          }

          // 2. a 태그 안 span 중 nth-child(2)를 display: none으로 설정
          const spans = link.querySelectorAll("span");
          if (spans.length > 1) {
            spans[1].style.display = "none"; // nth-child(2)에 해당 (0-based index이므로 1)
          }
        });
      }}
      render={() => (
        <div className="section text-center">
          {slides.map((slide, index) => (
            <div className="slide" key={index}>
              <div className="flex flex-col justify-center items-center min-h-screen bg-black">
                {slide.content}
              </div>
            </div>
          ))}
        </div>
      )}
    />
    </>
  );
};

export default Beginning;
