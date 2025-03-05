import { useEffect, useRef } from "react";

const Character = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameCount = 6;
    const frameRate = 175; // 프레임 속도 (밀리초)

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const images: HTMLImageElement[] = [];
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `/images/characters/player/idle0${i}.png`;
            images.push(img);
        }

        let currentFrame = 0;
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[currentFrame], 0, 0, canvas.width, canvas.height);
            currentFrame = (currentFrame + 1) % frameCount;
            setTimeout(animate, frameRate);
        };

        images[0].onload = () => {
            animate();
        };
    }, []);

    return <canvas ref={canvasRef} width={250} height={250}></canvas>;
};

export default Character;