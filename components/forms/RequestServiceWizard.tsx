'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { LOCATIONS } from '@/lib/data/locations';
import { SERVICES } from '@/lib/data/services';
import { supabaseBrowser } from '@/lib/supabase/client';
import { getWhatsAppLinkFor } from '@/lib/whatsapp';
import { useSiteContent } from '@/lib/sanity/site-content-context';
import { getFirstTouch } from '@/components/analytics/FirstTouchCapture';
import { track } from '@/lib/analytics/track';
import type { Attribution } from '@/lib/shared/schemas';

interface UploadedFile {
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: 'image' | 'video';
  previewUrl: string;
}

const TOTAL_STEPS = 7;

export function RequestServiceWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draftId] = useState(() => crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const [location, setLocation] = useState({ country: '', region: '', city: '' });
  const [serviceType, setServiceType] = useState('');
  const [vessel, setVessel] = useState({ make: '', model: '', year: '', name: '', hin: '' });
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', preferredContactMethod: 'phone' as const });
  const [website, setWebsite] = useState(''); // honeypot — real users never see this field

  // Attribution — captured automatically once, never typed by the visitor.
  const [attribution, setAttribution] = useState<Attribution>({});
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const firstTouch = getFirstTouch();

    setAttribution({
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      utmContent: params.get('utm_content') ?? undefined,
      source: params.get('utm_source') ?? undefined,
      medium: params.get('utm_medium') ?? undefined,
      campaign: params.get('utm_campaign') ?? undefined,
      referrer: document.referrer || undefined,
      landingPage: window.location.href,
      // First-touch — read from the cookie set on the visitor's
      // original visit, never re-captured here (see FirstTouchCapture.tsx).
      firstUtmSource: firstTouch?.first_utm_source,
      firstUtmMedium: firstTouch?.first_utm_medium,
      firstUtmCampaign: firstTouch?.first_utm_campaign,
      firstUtmContent: firstTouch?.first_utm_content,
      firstReferrer: firstTouch?.first_referrer,
      firstLandingPage: firstTouch?.first_landing_page,
      firstTouchAt: firstTouch?.first_touch_at,
    });

    track('request_service_started');
  }, []);

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (media.length + files.length > 10) {
      setSubmitError('Maximum 10 files per request.');
      return;
    }
    setUploading(true);
    setSubmitError(null);

    for (const file of Array.from(files)) {
      try {
        const initRes = await fetch('/api/media-upload/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftId, fileName: file.name, mimeType: file.type, sizeBytes: file.size }),
        });
        if (!initRes.ok) {
          const err = await initRes.json();
          throw new Error(err.error ?? 'Upload preparation failed.');
        }
        const { path, token, kind } = await initRes.json();

        const { error: uploadError } = await supabaseBrowser.storage
          .from('lead-media')
          .uploadToSignedUrl(path, token, file);
        if (uploadError) throw uploadError;

        setMedia((prev) => [
          ...prev,
          { path, fileName: file.name, mimeType: file.type, sizeBytes: file.size, kind, previewUrl: URL.createObjectURL(file) },
        ]);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Upload failed.');
      }
    }
    setUploading(false);
  }

  function removeFile(path: string) {
    setMedia((prev) => prev.filter((f) => f.path !== path));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location,
        serviceType,
        vessel: { ...vessel, year: vessel.year ? Number(vessel.year) : undefined },
        description,
        media: media.map(({ path, fileName, mimeType, sizeBytes, kind }) => ({
          storagePath: path,
          fileName,
          mimeType,
          sizeBytes,
          kind,
        })),
        customer,
        attribution,
        website, // honeypot
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setSubmitError(data.error ?? 'Something went wrong. Please try again.');
      return;
    }

    setReferenceCode(data.referenceCode);
    track('request_service_completed', { serviceType, country: location.country });
    setStep(7);
  }

  const canProceed: Record<number, boolean> = {
    1: !!location.country && !!location.city,
    2: !!serviceType,
    3: !!vessel.make && !!vessel.model,
    4: description.trim().length >= 10,
    5: !uploading,
    6: !!customer.name && !!customer.phone,
  };

  return (
    <div className="max-w-xl mx-auto px-5 md:px-0 py-14 md:py-20">
      {step < 7 && (
        <div className="flex items-center gap-1.5 mb-10">
          {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
            <div key={i} className={`h-[2px] flex-1 ${i + 1 <= step ? 'bg-gold' : 'bg-white/10'}`} />
          ))}
        </div>
      )}

      {step === 1 && (
        <Step title="Where is your vessel?" eyebrow="Step 1 of 6">
          <Select
            label="Country"
            value={location.country}
            onChange={(v) => setLocation((s) => ({ ...s, country: v }))}
            options={LOCATIONS.map((l) => ({ value: l.country, label: l.country }))}
          />
          <Input label="City" value={location.city} onChange={(v) => setLocation((s) => ({ ...s, city: v }))} />
          <Input
            label="State / Region (optional)"
            value={location.region}
            onChange={(v) => setLocation((s) => ({ ...s, region: v }))}
            optional
          />
        </Step>
      )}

      {step === 2 && (
        <Step title="What do you need help with?" eyebrow="Step 2 of 6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SERVICES.map((s) => (
              <button
                key={s.slug}
                onClick={() => setServiceType(s.slug)}
                className={`text-left p-4 border transition-colors ${
                  serviceType === s.slug ? 'border-gold bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <span className="font-mono text-[9px] text-gold">{s.num}</span>
                <div className="font-display text-sm font-semibold uppercase mt-1">{s.title}</div>
              </button>
            ))}
            <button
              onClick={() => setServiceType('other')}
              className={`text-left p-4 border transition-colors ${
                serviceType === 'other' ? 'border-gold bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <div className="font-display text-sm font-semibold uppercase">Other</div>
            </button>
          </div>
        </Step>
      )}

      {step === 3 && (
        <Step title="Tell us about your vessel." eyebrow="Step 3 of 6">
          <Input label="Make" value={vessel.make} onChange={(v) => setVessel((s) => ({ ...s, make: v }))} />
          <Input label="Model" value={vessel.model} onChange={(v) => setVessel((s) => ({ ...s, model: v }))} />
          <Input label="Year" value={vessel.year} onChange={(v) => setVessel((s) => ({ ...s, year: v }))} optional />
          <Input label="Vessel Name" value={vessel.name} onChange={(v) => setVessel((s) => ({ ...s, name: v }))} optional />
          <Input label="HIN" value={vessel.hin} onChange={(v) => setVessel((s) => ({ ...s, hin: v }))} optional />
        </Step>
      )}

      {step === 4 && (
        <Step title="Tell us what's happening." eyebrow="Step 4 of 6">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe the issue or the work you need done..."
            className="w-full bg-white/[0.03] border border-white/10 focus:border-gold outline-none px-4 py-3 text-sm text-marine-white placeholder:text-cool-gray/50"
          />
        </Step>
      )}

      {step === 5 && (
        <Step title="Upload photos or video." eyebrow="Step 5 of 6">
          <label className="block border border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-gold transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-cool-gray">
              {uploading ? 'Uploading…' : 'Tap to add photos or video'}
            </span>
          </label>

          {media.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {media.map((f) => (
                <div key={f.path} className="relative aspect-square bg-panel border border-white/10 overflow-hidden">
                  {f.kind === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.previewUrl} alt={f.fileName} className="w-full h-full object-cover" />
                  ) : (
                    <video src={f.previewUrl} className="w-full h-full object-cover" muted />
                  )}
                  <button
                    onClick={() => removeFile(f.path)}
                    className="absolute top-1 right-1 w-5 h-5 bg-navy/80 text-marine-white text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </Step>
      )}

      {step === 6 && (
        <Step title="Contact information." eyebrow="Step 6 of 6">
          <Input label="Name" value={customer.name} onChange={(v) => setCustomer((s) => ({ ...s, name: v }))} />
          <Input label="Phone" value={customer.phone} onChange={(v) => setCustomer((s) => ({ ...s, phone: v }))} />
          <Input label="Email" value={customer.email} onChange={(v) => setCustomer((s) => ({ ...s, email: v }))} optional />
          <Select
            label="Preferred Contact Method"
            value={customer.preferredContactMethod}
            onChange={(v) => setCustomer((s) => ({ ...s, preferredContactMethod: v as typeof s.preferredContactMethod }))}
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'email', label: 'Email' },
            ]}
          />
          {/* Honeypot — hidden from real users via CSS, not `type="hidden"`
              (bots that skip hidden inputs would evade this). Real users
              never see or fill it; a filled value signals a bot. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              name="website"
            />
          </div>

          {submitError && <p className="text-xs text-red-400 mt-2">{submitError}</p>}
        </Step>
      )}

      {step === 7 && referenceCode && <SuccessStep referenceCode={referenceCode} router={router} />}

      {step < 7 && (
        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <button onClick={() => setStep((s) => s - 1)} className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-cool-gray">
              ← Back
            </button>
          ) : (
            <span />
          )}

          {step < 6 ? (
            <button
              onClick={() => {
                track('request_service_step_completed', { step });
                setStep((s) => s + 1);
              }}
              disabled={!canProceed[step]}
              className="bg-gradient-to-r from-gold to-[#B8924A] text-navy font-bold text-[11px] uppercase tracking-[0.1em] px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed[6] || submitting}
              className="bg-gradient-to-r from-gold to-[#B8924A] text-navy font-bold text-[11px] uppercase tracking-[0.1em] px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Step({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-gold mb-2">{eyebrow}</span>
      <h1 className="font-display font-bold uppercase text-2xl md:text-3xl tracking-tight mb-8">{title}</h1>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[9.5px] uppercase tracking-[0.08em] text-cool-gray mb-1.5">
        {label} {optional && <span className="text-cool-gray/50">(optional)</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 focus:border-gold outline-none px-4 py-3 text-sm text-marine-white"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[9.5px] uppercase tracking-[0.08em] text-cool-gray mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 focus:border-gold outline-none px-4 py-3 text-sm text-marine-white"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-navy">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SuccessStep({ referenceCode, router }: { referenceCode: string; router: ReturnType<typeof useRouter> }) {
  // Fix 2 (Sprint 6): reads the SAME resolved contact config every
  // other component uses (Sanity primary, env fallback) via context,
  // instead of independently reading env vars — see app/[locale]/layout.tsx.
  const { whatsapp } = useSiteContent();
  const whatsappLink = getWhatsAppLinkFor(whatsapp, `Hi KCC, following up on request ${referenceCode}`);

  return (
    <div className="text-center py-10">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">Request Received</span>
      <h1 className="font-display font-bold uppercase text-3xl tracking-tight">{referenceCode}</h1>
      <p className="mt-4 text-sm text-cool-gray max-w-sm mx-auto leading-relaxed">
        Your request has been received. Keep this reference code — a member of the KCC team will be in touch.
      </p>
      <div className="flex flex-col items-center gap-3 mt-8">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-gold to-[#B8924A] text-navy font-bold text-[11px] uppercase tracking-[0.1em] px-6 py-3"
          >
            Message Us on WhatsApp
          </a>
        )}
        <button onClick={() => router.push('/')} className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-cool-gray">
          Return to site
        </button>
      </div>
    </div>
  );
}
