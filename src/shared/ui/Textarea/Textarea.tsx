import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'block w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          hasError
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200',
          className,
        )}
        {...rest}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
