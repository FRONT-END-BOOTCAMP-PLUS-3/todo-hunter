"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const FightField = () => {
    return (
        <div className="relative w-auto h-[150px]">
        <Image
          src="/images/backgrounds/underwater-fantasy-background3.png"
          alt="field image"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>);
};

export default FightField;