import React from 'react';
import { buttonStyles, ButtonVariant } from './index';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      loading = false,
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = buttonStyles[variant];
    const widthClass = fullWidth ? 'w-full' : '';
    const combinedClasses = `${baseClasses} ${widthClass} ${className}`;

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled ?? loading} {...props}>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            처리 중...
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
