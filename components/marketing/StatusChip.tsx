export function StatusChip({
  vesselName,
  status,
  technician,
  healthPercent = 82,
}: {
  vesselName: string;
  status: string;
  technician: string;
  healthPercent?: number;
}) {
  const circumference = 2 * Math.PI * 17;
  const offset = circumference - (healthPercent / 100) * circumference;

  return (
    <div className="absolute z-[4] right-5 bottom-6 md:right-10 md:bottom-16 max-w-[220px] flex items-center gap-3 bg-white/[0.045] backdrop-blur-[10px] border border-white/10 px-4 py-3.5">
      <div className="relative w-[42px] h-[42px] shrink-0">
        <svg width="42" height="42" viewBox="0 0 42 42" className="-rotate-90">
          <defs>
            <linearGradient id="statusChipGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C9A24B" />
              <stop offset="100%" stopColor="#4C7C9E" />
            </linearGradient>
          </defs>
          <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <circle
            cx="21"
            cy="21"
            r="17"
            fill="none"
            stroke="url(#statusChipGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
      </div>
      <div className="text-[10px]">
        <div className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-cool-gray">{vesselName}</div>
        <div className="font-display text-xs font-semibold text-marine-white mt-0.5">{status}</div>
        <div className="font-mono text-[9.5px] text-gold mt-[3px]">{technician}</div>
      </div>
    </div>
  );
}
