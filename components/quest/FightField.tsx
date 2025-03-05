"use client";

import React from "react";
import Image from "next/image";

const FightField = () => {
    return (
        <div className="relative w-auto h-[150px]">
        <Image
          src="/images/backgrounds/underwater-fantasy-background3.png"
          alt="field image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>);
};

export default FightField;