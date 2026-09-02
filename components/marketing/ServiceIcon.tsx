type IconType = 'bolt' | 'radar' | 'pulse' | 'compass' | 'speaker' | 'bulb' | 'battery' | 'pump' | 'wrench';

export function ServiceIcon({ type, bg }: { type: IconType; bg: string }) {
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" className="shrink-0">
      <rect width="56" height="56" fill={bg} />
      {type === 'bolt' && <path d="M30 6 L14 32 L26 32 L22 50 L42 24 L28 24 Z" fill="#C9A24B" />}
      {type === 'radar' && (
        <>
          <circle cx="28" cy="28" r="16" fill="none" stroke="#C9A24B" strokeWidth={2} />
          <circle cx="28" cy="28" r="4" fill="#C9A24B" />
        </>
      )}
      {type === 'pulse' && (
        <path d="M8 34 L18 34 L22 20 L28 40 L34 26 L40 34 L48 34" stroke="#C9A24B" strokeWidth={2} fill="none" />
      )}
      {type === 'compass' && (
        <>
          <circle cx="28" cy="28" r="14" fill="none" stroke="#C9A24B" strokeWidth={1.5} />
          <path d="M28 16 L28 28 L36 32" stroke="#C9A24B" strokeWidth={1.5} fill="none" />
        </>
      )}
      {type === 'speaker' && (
        <>
          <rect x="16" y="20" width="24" height="16" rx="2" fill="none" stroke="#C9A24B" strokeWidth={2} />
          <line x1="22" y1="24" x2="34" y2="32" stroke="#C9A24B" strokeWidth={1.5} />
        </>
      )}
      {type === 'bulb' && (
        <>
          <circle cx="28" cy="24" r="10" fill="none" stroke="#C9A24B" strokeWidth={2} />
          <line x1="24" y1="38" x2="32" y2="38" stroke="#C9A24B" strokeWidth={2} />
          <line x1="25" y1="42" x2="31" y2="42" stroke="#C9A24B" strokeWidth={1.5} />
        </>
      )}
      {type === 'battery' && (
        <>
          <rect x="18" y="18" width="20" height="20" rx="2" fill="none" stroke="#C9A24B" strokeWidth={2} />
          <line x1="22" y1="14" x2="22" y2="18" stroke="#C9A24B" strokeWidth={2} />
          <line x1="34" y1="14" x2="34" y2="18" stroke="#C9A24B" strokeWidth={2} />
        </>
      )}
      {type === 'pump' && (
        <>
          <circle cx="26" cy="30" r="10" fill="none" stroke="#C9A24B" strokeWidth={2} />
          <line x1="34" y1="24" x2="42" y2="16" stroke="#C9A24B" strokeWidth={2} />
        </>
      )}
      {type === 'wrench' && (
        <path
          d="M20 36 L32 24 M36 20 A5 5 0 1 1 30 26 L18 38 A3 3 0 0 0 22 42 L34 30"
          stroke="#C9A24B"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
