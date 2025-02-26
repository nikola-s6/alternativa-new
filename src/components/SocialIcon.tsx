import type { SimpleIcon } from 'simple-icons';

interface SocialIconProps {
  icon: SimpleIcon;
  size?: number;
  className?: string;
}

export function SocialIcon({
  icon,
  size = 20,
  className = '',
}: SocialIconProps) {
  return (
    <svg
      role='img'
      viewBox='0 0 24 24'
      width={size}
      height={size}
      className={className}
      fill='currentColor'
    >
      <path d={icon.path} />
    </svg>
  );
}
