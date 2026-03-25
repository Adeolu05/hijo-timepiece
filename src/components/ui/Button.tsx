import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '' 
}: { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'champagne', 
  size?: 'sm' | 'md' | 'lg', 
  className?: string 
} = {}) => {
    const baseStyles = "inline-flex items-center justify-center wide-label font-bold transition-all duration-700 ease-out disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary: "bg-primary text-white hover:bg-secondary border border-primary hover:border-secondary shadow-lg",
      secondary: "bg-secondary text-white hover:bg-primary border border-secondary hover:border-primary shadow-lg",
      outline: "border border-primary/20 text-primary hover:border-primary hover:bg-primary hover:text-white",
      ghost: "text-primary hover:text-secondary bg-transparent",
      champagne: "bg-secondary text-white hover:bg-primary shadow-xl hover:shadow-secondary/20",
    };
    const sizes = {
      sm: "px-8 py-4 !text-[8px]",
      md: "px-12 py-5 !text-[10px]",
      lg: "px-16 py-6 !text-[11px]",
    };
    return cn(baseStyles, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'champagne';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
