// Device mockups below are CONCEPTUAL UI, not the real application.
// Once real KCC Marine Cloud screenshots exist, they replace the
// inner content of .tablet/.phone directly — same frame, same
// perspective/glow treatment, real screenshot as the fill.
// Do not ship fictional dashboard UI once real screenshots exist.

interface FlowStep {
  label: string;
  status: 'done' | 'active' | 'pending';
}

const STEPS: FlowStep[] = [
  { label: 'Technician Assigned', status: 'done' },
  { label: 'Diagnosis Complete', status: 'done' },
  { label: 'Repair In Progress', status: 'active' },
  { label: 'Quality Control', status: 'pending' },
  { label: 'Completed', status: 'pending' },
];

function StatusRows({ steps, small = false }: { steps: FlowStep[]; small?: boolean }) {
  const icon = (s: FlowStep['status']) => (s === 'done' ? '✓' : s === 'active' ? '●' : '○');
  return (
    <div className={small ? 'mt-3.5 flex flex-col gap-1.5' : 'mt-3.5 flex flex-col gap-2'}>
      {steps.map((step) => (
        <div
          key={step.label}
          className={`flex items-center gap-2 ${small ? 'text-[7px]' : 'text-[9.5px]'} ${
            step.status === 'pending' ? 'text-marine-white/30' : ''
          }`}
        >
          <span
            className={`font-mono ${
              step.status === 'done' ? 'text-gold' : step.status === 'active' ? 'text-marine-white' : 'text-marine-white/30'
            }`}
          >
            {icon(step.status)}
          </span>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

export function TechnologyPreview() {
  return (
    <div className="relative h-[340px] md:h-[420px] flex items-center justify-center" style={{ perspective: '1200px' }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(320px 320px at 55% 50%, rgba(201,162,75,0.14), transparent 65%), radial-gradient(280px 280px at 30% 70%, rgba(76,124,158,0.16), transparent 65%)',
        }}
      />

      {/* Tablet */}
      <div
        className="relative z-[1] w-[78%] max-w-[320px] aspect-[3/4] bg-white/[0.03] backdrop-blur-[8px] border border-white/10 rounded-[14px] p-3.5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        style={{ transform: 'rotateY(-6deg) rotateX(2deg)' }}
      >
        <div className="font-display text-[10px] font-bold text-gold">KCC</div>
        <div className="font-mono text-[9px] text-cool-gray mt-2">VESSEL PROFILE</div>
        <div className="font-display text-[13px] font-bold mt-0.5">Sea Ray 340</div>
        <StatusRows steps={STEPS} />
        <div className="mt-4 flex gap-2.5 font-mono text-[7.5px] uppercase tracking-[0.06em] text-cool-gray">
          <span className="text-gold">Photos</span>
          <span>Documents</span>
          <span>Messages</span>
        </div>
      </div>

      {/* Phone */}
      <div
        className="absolute z-[2] right-[4%] -bottom-[6%] w-[34%] max-w-[130px] aspect-[9/18.5] bg-white/[0.04] backdrop-blur-[8px] border border-white/[0.12] rounded-2xl p-2.5 shadow-[-8px_20px_40px_rgba(0,0,0,0.55)]"
        style={{ transform: 'rotateY(-4deg)' }}
      >
        <div className="font-display text-[8px] font-bold text-gold">KCC</div>
        <div className="font-mono text-[6.5px] text-cool-gray mt-1">SEA RAY 340</div>
        <div className="font-display text-[9px] font-bold mt-0.5">Service Status</div>
        <StatusRows steps={STEPS.slice(0, 3)} small />
      </div>
    </div>
  );
}
