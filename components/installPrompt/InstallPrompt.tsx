"use client";

import { Button, Dialog } from "@/components/common";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const installHandler = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const closeHandler = () => {
    setDeferredPrompt(null);
  };

  useEffect(() => {
    const handlebeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handlebeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlebeforeInstallPrompt);
    };
  }, []);

  return (
    deferredPrompt && (
      <div>
        <Button onClick={installHandler}>
          홈 화면에 추가
        </Button>
        <Button onClick={closeHandler}>
          닫기
        </Button>
      </div>
    )
  );
}
