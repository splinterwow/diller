
import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statsCardVariants = cva(
  'rounded-lg p-6 transition-all duration-200 hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'bg-background border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface StatsCardProps extends VariantProps<typeof statsCardVariants> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  variant,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn(statsCardVariants({ variant }), 'animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </div>
  );
};

export default StatsCard;
