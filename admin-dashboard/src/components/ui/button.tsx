import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950",
        // Default variant
        variant === 'default' && "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 active:bg-blue-800 dark:active:bg-blue-800 focus:ring-blue-500",
        // Outline variant
        variant === 'outline' && "border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 focus:ring-blue-500",
        // Destructive variant
        variant === 'destructive' && "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 active:bg-red-800 dark:active:bg-red-800 focus:ring-red-500",
        // Ghost variant
        variant === 'ghost' && "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200 dark:active:bg-slate-700",
        // Sizes
        size === 'sm' && "px-3 py-1 text-sm",
        size === 'default' && "px-4 py-2",
        size === 'lg' && "px-6 py-3 text-lg",
        size === 'icon' && "p-2 rounded-full",
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:opacity-40',
        className,
      )}
      {...props}
    />
  );
}