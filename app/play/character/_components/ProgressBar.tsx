type ProgressBarProps = {
    nickname: string | undefined;
    progress: number | undefined;
};

const ProgressBar = ({ nickname, progress }: ProgressBarProps) => (
    <div className="flex flex-col items-center">
        <p className="mb-2 mt-20 text-xl text-white text-center">{nickname}님, 오늘의 경험치에요!</p>
        <div className="flex items-center w-full pl-5 pr-5 min-[360px]:pl-10 min-[360px]:pr-10 min-[480px]:pl-20 min-[480px]:pr-20 min-[720px]:pl-40 min-[720px]:pr-40">
            <p className="mr-2 text-white text-xl">{progress}%</p>
            <progress
                className="bg-white is-rounded-progress w-full"
                value={progress}
                max="100"
                aria-label={`${nickname}님의 경험치 진행 상태`}
            />
        </div>
    </div>
);

export default ProgressBar;
