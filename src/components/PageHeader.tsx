
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  children,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between animate-fade-in', className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
