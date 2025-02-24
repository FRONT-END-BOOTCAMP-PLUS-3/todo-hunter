import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "p-1 input-border outline-none",
  {
    variants: {
      state: {
        default: "input-border bg-white",
        current: "input-border state-current bg-white",
        success: "input-border state-success bg-white",
        warning: "input-border state-warning bg-white",
        error: "input-border state-error bg-white",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>;

// eslint-disable-next-line react/display-name
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

export { Input };