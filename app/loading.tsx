"use client";

import React, { useEffect } from "react";

interface LoadingProps {
  color: "black" | "white";
}

const Loading: React.FC<LoadingProps> = ({ color }) => {
  useEffect(() => {
    const spinnerColor = color === "black" ? "#fff" : "#333";
    document.documentElement.style.setProperty("--loading-spinner-color", spinnerColor);
  }, [color]);

  return (
    <div className={`flex flex-col justify-center items-center min-h-screen ${color === "black" ? "bg-black" : ""}`}>
      <div id="loading-spinner"></div>
      <br />
      <br />
      <br />
      <h1 className={`text-3xl font-bold ${color === "black" ? "text-white" : ""}`}>LOADING</h1>
      <br />
      <h3 className={`text-xl ${color === "black" ? "text-white" : ""}`}>페이지를 로드하고 있습니다.</h3>
    </div>
  );
};

export default Loading;