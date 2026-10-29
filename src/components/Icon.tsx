import React from 'react';

export interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

// Icon componet: if name contain <svg, render custom SVG, otherwise Google Material Symbol
export default function Icon({ name, className = 'text-xl', filled = false }: IconProps) {
  const raw = String(name || '').trim();
  const isCustomSvg = raw.startsWith('<svg') || raw.includes('<svg');

  if (isCustomSvg) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em] [&>svg]:fill-current ${className}`}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }

  return (
    <span
      className={`material-symbols-rounded ${filled ? 'material-symbols-filled' : ''} ${className}`}
      aria-hidden="true"
    >
      {raw || 'Apps'}
    </span>
  );
}
