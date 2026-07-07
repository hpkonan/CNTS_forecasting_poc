'use client';

import { useState } from 'react';

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export default function Tooltip({ label, children }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <button
        type="button"
        aria-label={`Explication : ${label}`}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-ldis-steel/50 text-[10px] font-semibold text-ldis-steel hover:bg-ldis-mist"
      >
        i
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-md bg-ldis-navy px-3 py-2 text-xs leading-snug text-white shadow-lg">
          {label}
        </span>
      )}
    </span>
  );
}
