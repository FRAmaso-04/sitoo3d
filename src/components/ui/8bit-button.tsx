'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface BitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'outline';
}

const EightBitButton = forwardRef<HTMLButtonElement, BitButtonProps>(
  ({ children, variant = 'red', style, className = '', ...props }, ref) => {
    const isRed = variant === 'red';
    return (
      <button
        ref={ref}
        className={`font-pixel uppercase ${className}`}
        style={{
          fontSize: '0.55rem',
          letterSpacing: '0.15em',
          padding: '10px 20px',
          border: 'none',
          borderRadius: 0,
          cursor: 'pointer',
          position: 'relative',
          background: isRed ? 'var(--red)' : 'transparent',
          color: isRed ? 'var(--white)' : 'var(--red)',
          outline: isRed ? 'none' : '2px solid var(--red)',
          outlineOffset: 0,
          boxShadow: isRed
            ? '4px 4px 0 #7a0808'
            : '4px 4px 0 rgba(204,17,17,0.4)',
          transition: 'transform 0.08s ease-out, box-shadow 0.08s ease-out',
          userSelect: 'none',
          ...style,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translate(2px, 2px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = isRed
            ? '2px 2px 0 #7a0808'
            : '2px 2px 0 rgba(204,17,17,0.4)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = '';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = isRed
            ? '4px 4px 0 #7a0808'
            : '4px 4px 0 rgba(204,17,17,0.4)';
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translate(4px, 4px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translate(2px, 2px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = isRed
            ? '2px 2px 0 #7a0808'
            : '2px 2px 0 rgba(204,17,17,0.4)';
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

EightBitButton.displayName = 'EightBitButton';
export default EightBitButton;
