import { Button } from "@/components/common";
import { useRouter } from "next/navigation";

const FindIdView = ({ loginId, error, onBack }: { loginId?: string | null, error?: string | null, onBack: () => void }) => {
    const router = useRouter();

    const handleMove = (value: string) => {
        router.push(`/${value}`); // URL 해시 변경
    };

    return (
        <>
        <div className="is-rounded-form w-full p-5 text-center">
            {error ? (
                <>
                <p>{error}</p>
                </>
            ) : (
                <>
                <p>당신의 아이디는</p>
                <p>&nbsp;</p>
                <p className="font-extrabold">{loginId}</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>지금부터 할일 사냥을 떠나볼까요?</p>
                </>
            )}
        </div>
        <div className="row w-full mt-[60px]">
            <Button style={{ width: "100%", marginLeft: 0, marginRight: 0 }} state="warning" size="L" onClick={onBack}>뒤로 가기</Button>
        </div>
        {!error && (
            <div className="row w-full mt-[20px]">
            <Button style={{ width: "100%", marginLeft: 0, marginRight: 0 }} state="success" size="L" onClick={() => handleMove('signin')}>로그인하기</Button>
            </div>
        )}
        </>
    );
}

export default FindIdView;