import React from 'react';
import { inputStyles } from './index';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'dark' | 'light';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = 'dark', className = '', ...props }, ref) => {
    const combinedClasses = `${inputStyles.base} ${inputStyles[variant]} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={combinedClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
