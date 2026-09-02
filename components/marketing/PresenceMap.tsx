const REGIONS = [
  { name: 'United States', city: 'Miami, FL', coord: '25.77° N, 80.19° W' },
  { name: 'Dominican Rep.', city: 'Santo Domingo', coord: '18.48° N, 69.93° W' },
  { name: 'Panama', city: 'Panama City', coord: '8.98° N, 79.52° W' },
  { name: 'Colombia', city: 'Cali', coord: '3.45° N, 76.53° W' },
];

export function PresenceMap() {
  return (
    <div>
      <div className="mt-5 relative aspect-[21/9] bg-panel border border-white/10 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid meet">
          <rect width="900" height="380" fill="#0B1826" />
          <g opacity={0.25} stroke="#9FB0C4" strokeWidth={0.5}>
            <line x1="0" y1="95" x2="900" y2="95" />
            <line x1="0" y1="190" x2="900" y2="190" />
            <line x1="0" y1="285" x2="900" y2="285" />
            <line x1="225" y1="0" x2="225" y2="380" />
            <line x1="450" y1="0" x2="450" y2="380" />
            <line x1="675" y1="0" x2="675" y2="380" />
          </g>
          <g fill="#C9A24B">
            <circle cx="180" cy="150" r="4" />
            <circle cx="270" cy="230" r="4" />
            <circle cx="330" cy="255" r="4" />
            <circle cx="300" cy="290" r="4" />
          </g>
          <path d="M180 150 L270 230 L330 255 L300 290" stroke="#C9A24B" strokeWidth={0.75} opacity={0.4} fill="none" />
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.08] mt-9">
        {REGIONS.map((r) => (
          <div key={r.name} className="bg-navy p-[22px_18px]">
            <div className="font-display text-[15px] font-semibold uppercase">{r.name}</div>
            <div className="text-[11.5px] text-cool-gray mt-1">{r.city}</div>
            <div className="font-mono text-[9px] text-gold mt-2">{r.coord}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
