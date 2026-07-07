interface IconProps {
  className?: string;
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.3 2.3L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BeakerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M9 3h6" strokeLinecap="round" />
      <path d="M10 3v6.5L5.5 17a2 2 0 001.7 3h9.6a2 2 0 001.7-3L14 9.5V3" strokeLinejoin="round" />
      <path d="M7 15h10" strokeLinecap="round" />
    </svg>
  );
}

export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        d="M12 2.5c3 4 6 8.2 6 11.8a6 6 0 11-12 0c0-3.6 3-7.8 6-11.8z"
        strokeLinejoin="round"
      />
      <path d="M9.5 15.2a2.6 2.6 0 002.6 2.6" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldAlertIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
      <path d="M12 8.5v4" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
