"use client";

import Image from "next/image";

interface EndingImageProps {
  image: string;
}

const EndingImage = ({ image }: EndingImageProps) => {
  return (
    <div className="relative w-full aspect-video">
      <Image src={image} alt="엔딩 이미지" fill className="object-cover" />
    </div>
  );
};

export default EndingImage;
