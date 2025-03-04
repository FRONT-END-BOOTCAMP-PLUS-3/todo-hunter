"use client";

interface EndingScriptBoxProps {
  script: string;
}

const EndingScriptBox = ({ script }: EndingScriptBoxProps) => {
  return (
    <div className="is-rounded bg-white">
      <p className="text-lg text-center max-w-md">{script}</p>
    </div>
  );
};

export default EndingScriptBox;
