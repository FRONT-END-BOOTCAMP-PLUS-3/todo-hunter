import { CharacterDto } from "@/application/usecases/character/dtos";


const Status = ({ str, int, emo, fin, liv }: CharacterDto) => {
    return (
        <div className="is-rounded-progress custom-status-size ml-5">
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">체력</p>
                    <progress className="progress-bar-bg is-rounded-progress w-9/12 progress-red" value={str} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">지력</p>
                    <progress className="progress-bar-bg is-rounded-progress w-9/12" value={int} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">감성</p>
                    <progress className="progress-bar-bg is-rounded-progress w-9/12 progress-purple" value={emo} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">경제력</p>
                    <progress className="progress-bar-bg is-rounded-progress w-9/12 progress-green" value={fin} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">생활력</p>
                    <progress className="progress-bar-bg is-rounded-progress w-9/12 progress-yellow" value={liv} max="30"></progress>
                </div>
        </div>
    );
}

export default Status;