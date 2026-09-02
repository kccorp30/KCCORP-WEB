// TEMPORARY DATA SOURCE.
// This hardcoded array is a stand-in for the Sanity `service` schema
// (see kccorp-web-pre-sprint1.md, section 6). It exists so Sprint 2
// can build real pages without waiting for Sprint 5. When Sanity is
// connected, this file is deleted and replaced by a GROQ query —
// the page components should not need to change shape, only the
// data source.

export interface Service {
  slug: string;
  num: string;
  title: string;
  spec: string; // short spec — used on cards/lists
  color: string;
  icon: 'bolt' | 'radar' | 'pulse' | 'compass' | 'speaker' | 'bulb' | 'battery' | 'pump' | 'wrench';
  description: string; // longer, for detail page
  imageUrl?: string; // real photography — Sprint 5 (Sanity). Empty = SVG/gradient fallback renders.
  videoUrl?: string; // optional hero video for the service detail page
  videoPlaybackId?: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'marine-electrical',
    num: '01',
    title: 'Marine Electrical',
    spec: 'Systems · Rewiring · Charging',
    color: '#12233A',
    icon: 'bolt',
    description:
      'Full marine electrical systems work — from panel upgrades and rewiring to charging system design. Every job is documented and tested against manufacturer specifications before sign-off.',
  },
  {
    slug: 'marine-electronics',
    num: '02',
    title: 'Marine Electronics',
    spec: 'Navigation · Displays · Integration',
    color: '#0F1E30',
    icon: 'radar',
    description:
      'Integration of navigation displays, sensors, and electronics into a single reliable system — configured to work together, not just installed side by side.',
  },
  {
    slug: 'diagnostics',
    num: '03',
    title: 'Diagnostics',
    spec: 'Troubleshooting · Electrical analysis',
    color: '#12233A',
    icon: 'pulse',
    description:
      'Systematic electrical and systems diagnostics to identify root causes — not just symptoms. Every diagnosis is documented with findings before any repair work begins.',
  },
  {
    slug: 'navigation-gps',
    num: '04',
    title: 'Navigation & GPS',
    spec: 'Chartplotters · AIS · Autopilot',
    color: '#0F1E30',
    icon: 'compass',
    description:
      'Chartplotter, AIS, and autopilot installation and calibration — built around how you actually navigate, not a generic factory setup.',
  },
  {
    slug: 'audio-systems',
    num: '05',
    title: 'Audio Systems',
    spec: 'Marine-grade speakers · Amplifiers',
    color: '#12233A',
    icon: 'speaker',
    description:
      'Marine-rated audio systems designed to survive the environment — corrosion-resistant components, proper gain staging, and clean integration with existing electrical.',
  },
  {
    slug: 'lighting',
    num: '06',
    title: 'Lighting',
    spec: 'LED Systems · Underwater · Deck',
    color: '#0F1E30',
    icon: 'bulb',
    description:
      'LED lighting systems for deck, cabin, and underwater applications — engineered for marine electrical loads, not repurposed automotive parts.',
  },
  {
    slug: 'batteries-charging',
    num: '07',
    title: 'Batteries & Charging',
    spec: 'Banks · Chargers · Monitoring',
    color: '#12233A',
    icon: 'battery',
    description:
      'Battery bank design, charging system installation, and monitoring — sized correctly for your actual power draw, not a generic recommendation.',
  },
  {
    slug: 'pumps-bilge',
    num: '08',
    title: 'Pumps / Bilge Systems',
    spec: 'Bilge · Freshwater · Livewell',
    color: '#0F1E30',
    icon: 'pump',
    description:
      'Bilge, freshwater, and livewell pump systems — installed, wired, and tested with proper float switch logic and backup redundancy where it matters.',
  },
  {
    slug: 'custom-installations',
    num: '09',
    title: 'Custom Installations',
    spec: 'Tailored systems · Non-standard builds',
    color: '#12233A',
    icon: 'wrench',
    description:
      'For work that does not fit a standard category — custom electrical or electronics installations engineered around your specific vessel and use case.',
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
