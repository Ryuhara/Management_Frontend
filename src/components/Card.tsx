import { ReactNode, CSSProperties } from 'react';
import Button from './Button';

interface CardAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface CardProps {
  children: ReactNode;
  title?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  style?: CSSProperties;
  onClick?: () => void;
  actions?: CardAction[];
  footer?: ReactNode;
}

export default function Card({
  children,
  title,
  variant = 'default',
  style,
  onClick,
  actions,
  footer
}: CardProps) {
  const baseStyle: CSSProperties = {
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid',
    transition: 'all 0.2s',
    cursor: onClick ? 'pointer' : 'default',
  };

  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    success: {
      backgroundColor: '#efe',
      borderColor: '#cfc',
      color: '#060',
    },
    error: {
      backgroundColor: '#fee',
      borderColor: '#fcc',
      color: '#c00',
    },
    warning: {
      backgroundColor: '#fef9e6',
      borderColor: '#f5d576',
      color: '#856404',
    },
    info: {
      backgroundColor: '#e3f2fd',
      borderColor: '#90caf9',
      color: '#0d47a1',
    },
  };

  const hoverStyle: CSSProperties = onClick ? {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  } : {};

  return (
    <div
      onClick={onClick}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow || '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
    >
      {title && (
        <h3 style={{
          marginTop: 0,
          marginBottom: '12px',
          fontSize: '1.25rem',
          fontWeight: 600,
        }}>
          {title}
        </h3>
      )}

      <div style={{ marginBottom: actions || footer ? '16px' : 0 }}>
        {children}
      </div>

      {actions && actions.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'primary'}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {footer && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}
