import { useEffect, useRef } from "react";

const Character = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null); // 캔버스 요소에 대한 참조 생성
    const frameCount = 6; // 애니메이션 프레임 수
    const frameRate = 175; // 프레임 속도 (밀리초)

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const images: HTMLImageElement[] = [];
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `/images/characters/player/idle0${i}.png`; // 이미지 경로 설정
            images.push(img);
        }

        let currentFrame = 0;
        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 지우기
            context.drawImage(images[currentFrame], 0, 0, canvas.width, canvas.height); // 현재 프레임 이미지 그리기
            currentFrame = (currentFrame + 1) % frameCount; // 다음 프레임으로 이동
            setTimeout(animate, frameRate); // 다음 프레임 호출
        };

        images[0].onload = () => {
            animate(); // 첫 번째 이미지 로드 후 애니메이션 시작
        };
    }, []);

    return <canvas ref={canvasRef} width={250} height={250}></canvas>; // 캔버스 요소 반환
};

export default Character;