import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/shared/lib/cn';

interface MarkdownReportProps {
  markdown: string;
  className?: string;
}

export const MarkdownReport = ({ markdown, className }: MarkdownReportProps) => {
  return (
    <div
      className={cn(
        'prose prose-slate max-w-none',
        'prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-slate-900',
        'prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2',
        'prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2',
        'prose-p:leading-relaxed prose-p:text-slate-700',
        'prose-li:marker:text-indigo-400 prose-li:text-slate-700',
        'prose-strong:text-slate-900',
        'prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none',
        'prose-table:text-sm prose-thead:bg-slate-50 prose-th:p-2 prose-td:p-2 prose-table:border prose-table:border-slate-200',
        'prose-a:text-indigo-600 hover:prose-a:text-indigo-700',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};
