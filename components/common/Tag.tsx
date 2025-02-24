import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { STATUS } from "@/constants";

type StatusKey = keyof typeof STATUS;
type StatusVariant = StatusKey | "default";

const tagVariants = cva(
  "two-step-border inline-flex items-center px-2.5 py-0.5 text-sm font-semibold",
  {
    variants: {
      variant: {
        default: "bg-white text-black",
        STR: "bg-red-500 text-white",
        INT: "bg-blue-500 text-white",
        EMO: "bg-purple-500 text-white",
        FIN: "bg-green-500 text-white",
        LIV: "bg-yellow-500 text-white",
      } satisfies Record<StatusVariant, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  variant?: StatusVariant;
}

function Tag({ className, variant, children, ...props }: TagProps) {
  return (
    <div className={cn(tagVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Tag, tagVariants };
