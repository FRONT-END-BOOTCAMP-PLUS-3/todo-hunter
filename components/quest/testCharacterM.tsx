import { useEffect, useRef } from "react";

type CharacterProps = {
    width: number;
    height: number;
    images: string[];
};

const Character = ({ width, height, images }: CharacterProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameCount = images.length;
    const frameRate = 150;

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const imageElements: HTMLImageElement[] = [];
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
            imageElements.push(img);
        });

        let currentFrame = 0;
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(imageElements[currentFrame], 0, 0, canvas.width, canvas.height);
            currentFrame = (currentFrame + 1) % frameCount;
            setTimeout(animate, frameRate);
        };

        imageElements[0].onload = () => {
            animate();
        };
    }, [images]);

    return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};

export default Character;