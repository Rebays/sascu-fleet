import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default'|'success' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
          variant === 'default' && 'bg-blue-100 text-blue-800',
          variant === 'success' && 'bg-green-100 text-green-600',
          variant === 'secondary' && 'bg-gray-300 text-gray-700',
          variant === 'destructive' && 'bg-red-100 text-red-800',
          variant === 'outline' && 'bg-transparent border border-gray-200 text-gray-800',
          className
      )}
      {...props}
    />
  );
}