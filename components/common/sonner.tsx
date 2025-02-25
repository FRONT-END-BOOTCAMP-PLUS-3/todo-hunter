"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ position = "top-center", ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      className="toaster group fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
      toastOptions={{
        classNames: {          
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:text-xl group-[.toaster]:two-step-border flex items-center justify-center text-center",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
