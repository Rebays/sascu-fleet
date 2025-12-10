import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
          variant === 'default' && 'bg-blue-100 text-blue-800',
          variant === 'secondary' && 'bg-gray-100 text-gray-800',
          variant === 'destructive' && 'bg-red-100 text-red-800',
          variant === 'outline' && 'bg-transparent border border-gray-200 text-gray-800',
          className
      )}
      {...props}
    />
  );
}