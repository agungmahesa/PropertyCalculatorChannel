import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

export function Badge({
    children,
    variant = 'default',
    className = '',
    ...props
}: BadgeProps) {
    const baseStyles = 'badge';

    const variants = {
        default: 'badge-primary',
        secondary: 'badge-secondary',
        outline: 'badge-outline',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
    };

    return (
        <span
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
