import { RenderTitleDTO } from "@/application/usecases/title/dtos";
import Image from "next/image";

type TitleItemProps = {
    title: RenderTitleDTO;
    index: number;
};

const RenderTitleItem = ({ title, index }: TitleItemProps) => {
    const imageUrl = title.titleId ? `/titles/title_df.png` : `${title.img}`;
    return (
        <div key={index} className="items-center justify-center text-center">
            <Image 
                className="mx-auto" 
                src={imageUrl} 
                alt={`${title.name || "칭호"} 이미지`} 
                width={120} // 기본 이미지 크기
                height={120} 
                loading={index === 0 ? "eager" : "lazy"} // 첫 번째 이미지는 eager 로드
                priority={index === 0} // 첫 번째 이미지는 우선 로드
                sizes="(max-width: 414px) 100px, 120px"
                placeholder="blur"
                blurDataURL="/titles/title_blur.png" // 블러 처리된 이미지
            />
            <p className="mt-2 text-sm">{title.name}</p>
        </div>
    );
}

export default RenderTitleItem;