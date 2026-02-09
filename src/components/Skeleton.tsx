/**
 * Skeleton Loader Component
 * Loading placeholder for content that's being fetched
 */

export default function Skeleton({
  className = '',
  variant = 'text',
}: {
  className?: string;
  variant?: 'text' | 'card' | 'circular';
}) {
  const baseStyles = 'animate-pulse bg-muted';

  const variantStyles = {
    text: 'h-4 w-3/4 rounded',
    card: 'h-32 w-full rounded-lg',
    circular: 'h-10 w-10 rounded-full',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} />
  );
}
