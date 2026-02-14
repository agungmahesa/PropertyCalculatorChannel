import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', error, ...props }, ref) => {
        return (
            <input
                className={`input ${error ? 'border-destructive focus-visible:ring-destructive' : ''} ${className}`}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";
