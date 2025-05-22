"use client";

import { Button } from "@/components/common";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  const installHandler = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        localStorage.setItem("pwaPromptDismissed", "true");
        setDeferredPrompt(null);
      });
    }
  };

  // 5분 후에 다시 뜨게
  const closeHandler = () => {
    const nextShow = Date.now() + 5 * 60 * 1000; // 5분 후 타임스탬프
    localStorage.setItem("pwaPromptNextShow", nextShow.toString());
    setDeferredPrompt(null);
    setShowIOSPrompt(false);
  };

  // 영구히 거절
  const neverShowHandler = () => {
    localStorage.setItem("pwaPromptDismissed", "true");
    setDeferredPrompt(null);
    setShowIOSPrompt(false);
  };

  useEffect(() => {
    const isPromptDismissed = localStorage.getItem("pwaPromptDismissed") === "true";
    if (isPromptDismissed) return;

    const nextShow = localStorage.getItem("pwaPromptNextShow");
    if (nextShow && Date.now() < Number(nextShow)) return;

    // iOS 디바이스에서 PWA 설치 프롬프트를 표시하지 않도록 처리
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }
    // IOS 제외한 브라우저에서만 PWA 설치 프롬프트를 처리
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  return (
    <>
      {deferredPrompt && (
        <div className="is-rounded p-2 m-3 fixed bg-white z-10 left-0 right-0">
          <div className="flex justify-center space-x-2">
            <Image src={"/icons/32.png"} alt="설치 유도 아이콘" width={50} height={50} className="mr-5" />
            <p>홈 화면에 추가하여 <br />앱처럼 사용해보세요!</p>
          </div>
          <div className="flex justify-center space-x-2">
            <Button size="M" state={"success"} onClick={installHandler}>
              홈 화면에 추가
            </Button>
            <Button size="XS" onClick={closeHandler}>
              닫기
            </Button>
            <Button size="XS" onClick={neverShowHandler}>
              다시는 표시하지 않음
            </Button>
          </div>
        </div>
      )}

      {showIOSPrompt && (
        <div className="is-rounded p-2 m-3 fixed bg-white z-10 left-0 right-0">
          <div className="flex justify-center space-x-2">
            <Image src={"/icons/32.png"} alt="설치 유도 아이콘" width={50} height={50} className="mr-5" />
            <p><i className="hn hn-external-link-solid"></i> 공유버튼을 누른 후 <br /> 
            &quot;홈 화면에 추가&quot;를 선택하세요!</p>
          </div>
          <div className="flex justify-center space-x-2">
            <Button size="M" onClick={neverShowHandler}>
              다시는 표시하지 않음
            </Button>
            <Button size="XS" onClick={closeHandler}>
              닫기
            </Button>
            
          </div>
        </div>
      )}
    </>
  );
}
