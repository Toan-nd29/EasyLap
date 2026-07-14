import { useMemo, useState } from 'react';
import { ImageOff } from 'lucide-react';

const BLOCKED_IMAGE_HOSTS = ['microless.com'];

const isBlockedHost = (hostname) =>
  BLOCKED_IMAGE_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));

const getSafeImageUrl = (src) => {
  if (!src || typeof src !== 'string') return '';

  const trimmed = src.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('/')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    if (isBlockedHost(parsed.hostname.toLowerCase())) return '';
    return trimmed;
  } catch {
    return '';
  }
};

const LaptopImage = ({
  laptop,
  src,
  alt,
  className = 'w-full h-full object-contain mix-blend-multiply',
  fallbackClassName = 'w-full h-full',
  iconClassName = 'w-6 h-6',
}) => {
  const imageUrl = src || laptop?.image_url || '';
  const safeImageUrl = useMemo(() => getSafeImageUrl(imageUrl), [imageUrl]);
  const [failedUrl, setFailedUrl] = useState('');
  const hasError = Boolean(safeImageUrl && failedUrl === safeImageUrl);

  if (!safeImageUrl || hasError) {
    return (
      <div className={`${fallbackClassName} flex flex-col items-center justify-center gap-2 text-gray-400`}>
        <ImageOff className={iconClassName} />
        <span className="text-xs font-medium">No image</span>
      </div>
    );
  }

  return (
    <img
      src={safeImageUrl}
      alt={alt || laptop?.name || 'Laptop'}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailedUrl(safeImageUrl)}
    />
  );
};

export default LaptopImage;
