import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  /**
   * Optional custom className
   */
  className?: string;

  /**
   * Optional loading text to display
   */
  text?: string;

  /**
   * Size of the loader - default, small, large
   */
  size?: 'default' | 'small' | 'large';

  /**
   * Whether to center the loader in the page
   */
  centered?: boolean;

  /**
   * Whether to use a full-page overlay
   */
  fullPage?: boolean;

  /**
   * Whether the loader should take up the full viewport height
   */
  fullHeight?: boolean;
}

export function PageLoader({
  className,
  text = 'Учитавање',
  size = 'default',
  centered = true,
  fullPage = false,
  fullHeight = true,
}: PageLoaderProps) {
  // Determine the size of the spinner
  const spinnerSize = {
    small: 'h-5 w-5',
    default: 'h-8 w-8',
    large: 'h-12 w-12',
  }[size];

  // Determine the size of the text
  const textSize = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
  }[size];

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        centered && 'h-full min-h-[400px]',
        fullHeight && 'min-h-screen',
        fullPage && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
        className
      )}
      role='status'
      aria-live='polite'
    >
      <Loader2 className={cn('animate-spin text-primary', spinnerSize)} />
      {text && (
        <p className={cn('text-muted-foreground font-medium', textSize)}>
          {text}
        </p>
      )}
    </div>
  );

  return content;
}
