import { Newspaper } from 'lucide-react';

interface NewsPlaceholderProps {
  className?: string;
}

export function NewsPlaceholder({ className = '' }: NewsPlaceholderProps) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-primary/10 ${className}`}
    >
      <div className='text-center'>
        <Newspaper className='h-16 w-16 mx-auto text-primary/50' />
        <p className='mt-2 text-sm text-primary/70 font-medium'>
          No image available
        </p>
      </div>
    </div>
  );
}
