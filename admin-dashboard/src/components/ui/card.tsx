import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm border-gray-200 dark:border-slate-700",
        className
      )}
      {...props}
    />
  );
}