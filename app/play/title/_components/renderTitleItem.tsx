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
                    <Image src={imageUrl} alt="칭호이미지" width={100} height={100} />
                    <p>{title.name}</p>
                </div>
            );
}

export default RenderTitleItem;