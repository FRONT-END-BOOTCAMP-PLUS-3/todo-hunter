import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "p-1 two-step-border outline-none",
  {
    variants: {
      // 상태별 스타일
      state: {
        default: "two-step-border bg-white",
        current: "two-step-border state-current bg-white",
        success: "two-step-border state-success bg-white",
        warning: "two-step-border state-warning bg-white",
        error: "two-step-border state-error bg-white",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ state }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
