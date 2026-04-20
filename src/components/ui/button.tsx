import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center transition-opacity focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 tracking-wide font-medium";
    
    const variants = {
      primary: "bg-text-primary text-background-main rounded-none hover:opacity-80",
      secondary: "border border-text-primary text-text-primary bg-transparent rounded-none hover:bg-background-sub",
      ghost: "bg-transparent text-text-primary hover:bg-background-sub rounded-none",
    };

    const sizes = {
      default: "h-11 px-8 py-3",
      sm: "h-9 px-4 text-sm",
      lg: "h-14 px-10 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
