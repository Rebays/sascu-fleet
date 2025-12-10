import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
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
        "px-4 py-2 rounded-lg font-medium transition-all",
        variant === 'default' && "bg-blue-600 text-white hover:bg-blue-700",
        variant === 'outline' && "border border-gray-300 text-gray-700 hover:bg-gray-50",
        variant === 'destructive' && "bg-red-600 text-white hover:bg-red-700",
        size === 'sm' && "text-sm",
        size === 'lg' && "text-lg py-3",
        size === 'icon' && "p-2 rounded-full",
        className
      )}
      {...props}
    />
  );
}