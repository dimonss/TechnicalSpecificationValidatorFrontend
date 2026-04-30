import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ className, children, ...rest }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({ className, children, ...rest }: CardSectionProps) => (
  <div className={cn('border-b border-slate-200 px-6 py-4', className)} {...rest}>
    {children}
  </div>
);

export const CardBody = ({ className, children, ...rest }: CardSectionProps) => (
  <div className={cn('px-6 py-5', className)} {...rest}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...rest }: CardSectionProps) => (
  <div className={cn('border-t border-slate-200 px-6 py-3', className)} {...rest}>
    {children}
  </div>
);
