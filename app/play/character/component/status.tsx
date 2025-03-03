type StatusProps = {
    status: number;
}

const Status = ({status}:StatusProps) => {
    return (
        <div className="is-rounded-progress custom-status-size ">
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">체력</p>
                    <progress className="bg-white is-rounded-progress w-9/12 progress-red" value={status} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">지력</p>
                    <progress className="bg-white is-rounded-progress w-9/12" value={status} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">감성</p>
                    <progress className="bg-white is-rounded-progress w-9/12 progress-purple" value={status} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">경제력</p>
                    <progress className="bg-white is-rounded-progress w-9/12 progress-green" value={status} max="30"></progress>
                </div>
                <div className="custom-progress is-rounded-progress">
                    <p className="text-white">생활력</p>
                    <progress className="bg-white is-rounded-progress w-9/12 progress-yellow" value={status} max="30"></progress>
                </div>
        </div>
    );
}

export default Status;