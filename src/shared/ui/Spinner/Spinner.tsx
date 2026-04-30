import { cn } from '@/shared/lib/cn';

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export const Spinner = ({ size = 24, className, label }: SpinnerProps) => {
  return (
    <div
      className={cn('inline-flex items-center gap-2 text-slate-500', className)}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
};
