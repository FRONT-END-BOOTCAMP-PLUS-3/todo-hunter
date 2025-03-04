import Image from "next/image";

type TitleItemProps = {
    title: {
        name: string;
        titleId: number;
        img: string;
    };
    index: number;
};

const RenderTitleItem = ({ title, index }: TitleItemProps) => {
    const imageUrl = title.titleId ? `/titles/title_df.png` : `${title.img}`;
    
            return (
                <div key={index} className="items-center justify-center text-center mb-10">
                    <Image src={imageUrl} alt="칭호이미지" width={100} height={100} />
                    <p>{title.name}</p>
                </div>
            );
}

export default RenderTitleItem;