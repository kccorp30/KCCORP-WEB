export function TechnicalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-sm text-gold">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.1em] mt-1 text-cool-gray">{label}</div>
    </div>
  );
}
