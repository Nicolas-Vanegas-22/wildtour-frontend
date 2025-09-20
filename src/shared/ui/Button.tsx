import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg hover:from-primary-700 hover:to-primary-600 hover:shadow-xl focus-visible:ring-primary-500',
        secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-lg hover:from-secondary-700 hover:to-secondary-600 hover:shadow-xl focus-visible:ring-secondary-500',
        accent: 'bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg hover:from-accent-700 hover:to-accent-600 hover:shadow-xl focus-visible:ring-accent-500',
        outline: 'border-2 border-primary-300 text-primary-700 bg-white hover:bg-primary-50 hover:border-primary-400 focus-visible:ring-primary-500',
        ghost: 'text-primary-700 hover:bg-primary-50 hover:text-primary-800 focus-visible:ring-primary-500',
        coral: 'bg-gradient-to-r from-coral-600 to-coral-500 text-white shadow-lg hover:from-coral-700 hover:to-coral-600 hover:shadow-xl focus-visible:ring-coral-500',
        sky: 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg hover:from-sky-700 hover:to-sky-600 hover:shadow-xl focus-visible:ring-sky-500',
        danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:from-red-700 hover:to-red-600 hover:shadow-xl focus-visible:ring-red-500',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        xl: 'h-16 px-10 text-lg',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, asChild, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref as any}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };