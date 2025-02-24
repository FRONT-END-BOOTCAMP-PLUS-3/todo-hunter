import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"


import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex p-2 m-1 items-center justify-center transition-colors duration-500 two-step-border whitespace-nowrap overflow-hidden text-ellipsis",
  {
    variants: {
      size:{
        L: "w-80 h-7",
        M: "w-56 h-7",
        S: "w-32 h-7",
        XS: "w-12 h-7",
      },
      state: {
        default: "text-black active:bg-black active:text-white",
        error: "bg-[var(--error-color-red)] text-white active:bg-red-900",
        success: "bg-[var(--success-color-blue)] text-white active:bg-blue-900",
        current: "bg-[var(--current-color-green)] text-white active:bg-green-900",
        warning: "bg-[var(--warning-color-yellow)] text-white active:bg-yellow-900",
      },
    },
    
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, state, size, asChild = false,...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ state, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button"

export { Button, buttonVariants }
