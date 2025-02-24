import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "p-2 w-80 font-['DungGeunMo'] outline-none",
  {
    variants: {
      // 크기별 스타일: width/height 값
      inputSize: {
        L: "w-80 h-7",
        M: "w-56 h-7",
        S: "w-32 h-7",
      },

     //상태별 스타일: 기본, 현재, 성공, 경고, 에러
      state: {
        default: "shadow-[2px_0_black,-2px_0_black,0_-2px_black,0_2px_black] bg-white",
        current: "shadow-[2px_0_var(--current-color-green),-2px_0_var(--current-color-green),0_-2px_var(--current-color-green),0_2px_var(--current-color-green)] bg-white",
        success: "shadow-[2px_0_var(--success-color-blue),-2px_0_var(--success-color-blue),0_-2px_var(--success-color-blue),0_2px_var(--success-color-blue)] bg-white",
        warning: "shadow-[2px_0_var(--warning-color-yellow),-2px_0_var(--warning-color-yellow),0_-2px_var(--warning-color-yellow),0_2px_var(--warning-color-yellow)] bg-white",
        error: "shadow-[2px_0_var(--error-color-red),-2px_0_var(--error-color-red),0_-2px_var(--error-color-red),0_2px_var(--error-color-red)] bg-white",
      },
    },
  //기본 스타일
    defaultVariants: {
      inputSize: "M",
      state: "default",
    },
  }
);

type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, state, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ inputSize, state }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
