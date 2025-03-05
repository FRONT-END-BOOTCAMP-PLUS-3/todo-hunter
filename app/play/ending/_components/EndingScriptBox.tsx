"use client";

interface EndingScriptBoxProps {
  script: string;
}

const EndingScriptBox = ({ script }: EndingScriptBoxProps) => {
  return (
    <div className="is-rounded bg-white w-full">
      <p className="text-lg text-center ">{script}</p>
    </div>
  );
};

export default EndingScriptBox;
