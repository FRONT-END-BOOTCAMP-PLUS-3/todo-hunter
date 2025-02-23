import { Input } from "@/components/ui/input";
 
export default function TutorialPage() {
  return (
    <div className="justify-center items-center m-4 max-w-3xl space-y-4">
      <Input inputSize="S" state="default"
        type="email"
        placeholder="S, default"
      />
      <div>
      {/* box-shadow: .lvl2 + state: success */}
      <Input inputSize="M" state="warning"
        type="password"
        placeholder="M, warning"
      />
      </div>
      {/* box-shadow: 없음 + state: default */}
      <Input inputSize="S" state="error"
        type="text"
        placeholder="S, error state"
      />
      <div>
      <Input inputSize="M" state="current"
        type="email"
        placeholder="M, current state"
      />
      </div>
      <div>            
        <Input inputSize="L" state="success"
        type="email"
        placeholder="L, success state"
      /></div>
    </div>
  );
}
