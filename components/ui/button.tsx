import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "shadow-[5px_0_black,-5px_0_black,0_-5px_black,0_5px_black] margin-[5px_auto] text-black active:bg-black active:text-white",
      },
      textSize: {
        default: "text-base", 
        sm: "text-xs",        
        lg: "text-lg",      
      },
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  height?: string;
  width?: string; 
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, textSize, asChild = false, height, width, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, textSize, className }))}
        style={{ height: height, width: width }}  
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button"

export { Button, buttonVariants }
