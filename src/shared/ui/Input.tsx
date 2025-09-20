import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

const inputVariants = cva(
  'flex w-full rounded-xl border bg-white px-4 py-3 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-visible:border-primary-500 focus-visible:ring-primary-500',
        success: 'border-green-300 focus-visible:border-green-500 focus-visible:ring-green-500',
        error: 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500 bg-red-50/50',
        warning: 'border-yellow-300 focus-visible:border-yellow-500 focus-visible:ring-yellow-500',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-13 px-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const finalVariant = error ? 'error' : variant;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            type={inputType}
            id={inputId}
            className={cn(
              inputVariants({ variant: finalVariant, size, className }),
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10'
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>

        {(error || helperText) && (
          <p className={cn(
            'mt-2 text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };