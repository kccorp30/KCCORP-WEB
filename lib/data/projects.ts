// TEMPORARY DATA SOURCE — same pattern as services.ts.
// Stand-in for the Sanity `project` schema until Sprint 5.
//
// IMPORTANT: vessel names/clients below are marked [example, placeholder]
// per the brief's rule against inventing real client names, stats, or
// testimonials. Replace with real project data before production launch —
// see content-placeholder-map.md.

export interface Project {
  slug: string;
  index: string;
  title: string;
  vessel: string;
  location: string;
  year: string;
  services: string[]; // service slugs
  tags: string[];
  color: string;
  problem: string;
  diagnosis: string;
  solution: string;
  equipmentInstalled: string[];
  result: string;
  imageUrl?: string; // real photography — Sprint 5 (Sanity). Empty = SVG/gradient fallback renders.
  videoUrl?: string;
  videoPlaybackId?: string;
  beforeImageUrl?: string; // for the before/after slider
  afterImageUrl?: string;
  gallery?: string[]; // additional gallery images, Sprint 5
}

export const PROJECTS: Project[] = [
  {
    slug: 'complete-helm-modernization',
    index: '001',
    title: 'Complete Helm Modernization',
    vessel: 'Sea Ray 340 — [example, placeholder]',
    location: 'Florida, USA',
    year: '[year pending]',
    services: ['navigation-gps', 'marine-electronics', 'marine-electrical'],
    tags: ['Navigation', 'Marine Electronics', 'Electrical', 'Custom Integration'],
    color: '#1C2C40',
    problem:
      'Outdated helm electronics with failing displays and an electrical system that had been modified multiple times over the vessel\'s life, without consistent documentation.',
    diagnosis:
      'Full electrical trace of the helm and navigation circuits, cross-referenced against original wiring diagrams to identify undocumented modifications and points of failure.',
    solution:
      'Complete helm rebuild — new navigation displays, rewired and properly labeled electrical runs, and full integration between navigation, engine data, and electrical monitoring.',
    equipmentInstalled: ['[Chartplotter model — pending]', '[Display units — pending]', 'New wiring harness, properly labeled and documented'],
    result:
      '[Result summary pending real project data — will describe the functional outcome once documented, without unverified statistics.]',
  },
  {
    slug: 'navigation-suite-upgrade',
    index: '002',
    title: 'Navigation Suite Upgrade',
    vessel: '[Vessel — example, placeholder]',
    location: 'Panama City, Panama',
    year: '[year pending]',
    services: ['navigation-gps', 'marine-electronics'],
    tags: ['Navigation', 'GPS', 'Integration'],
    color: '#12233A',
    problem: '[Problem summary pending real project data.]',
    diagnosis: '[Diagnosis summary pending real project data.]',
    solution: '[Solution summary pending real project data.]',
    equipmentInstalled: ['[Equipment list pending]'],
    result: '[Result summary pending real project data.]',
  },
  {
    slug: 'full-electrical-rewire',
    index: '003',
    title: 'Full Electrical Rewire',
    vessel: '[Vessel — example, placeholder]',
    location: 'Santo Domingo, Dominican Republic',
    year: '[year pending]',
    services: ['marine-electrical', 'batteries-charging'],
    tags: ['Electrical', 'Rewiring', 'Charging Systems'],
    color: '#0F1E30',
    problem: '[Problem summary pending real project data.]',
    diagnosis: '[Diagnosis summary pending real project data.]',
    solution: '[Solution summary pending real project data.]',
    equipmentInstalled: ['[Equipment list pending]'],
    result: '[Result summary pending real project data.]',
  },
  {
    slug: 'diagnostics-repower',
    index: '004',
    title: 'Diagnostics & Repower',
    vessel: '[Vessel — example, placeholder]',
    location: 'Cartagena, Colombia',
    year: '[year pending]',
    services: ['diagnostics', 'marine-electrical'],
    tags: ['Diagnostics', 'Electrical', 'Repower'],
    color: '#1C2C40',
    problem: '[Problem summary pending real project data.]',
    diagnosis: '[Diagnosis summary pending real project data.]',
    solution: '[Solution summary pending real project data.]',
    equipmentInstalled: ['[Equipment list pending]'],
    result: '[Result summary pending real project data.]',
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
