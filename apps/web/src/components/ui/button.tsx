import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  variant = 'default', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': variant === 'default',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500': variant === 'danger',
          'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500': variant === 'success',
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500': variant === 'outline',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}