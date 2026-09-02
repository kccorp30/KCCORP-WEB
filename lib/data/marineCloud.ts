// TEMPORARY DATA SOURCE — same pattern as services.ts/projects.ts.
// Stand-in for the Sanity `technologyContent` schema (page: 'marine-cloud')
// until Sprint 5.

export interface StoryBeat {
  num: string;
  title: string;
  description: string;
  imageUrl?: string; // real screenshot, Sprint 5
  device: 'desktop' | 'mobile';
  annotation: string;
}

export const MARINE_CLOUD_STORY: StoryBeat[] = [
  {
    num: '01',
    title: 'Your Vessel',
    description:
      'A permanent digital profile for your vessel — systems, service history, documentation, and health, all in one place that never gets lost between shops or seasons.',
    device: 'desktop',
    annotation: 'Vessel Profile',
  },
  {
    num: '02',
    title: 'Your Service',
    description:
      'Follow every job from request to completion. No guessing what stage your vessel is at — the status is always current, always visible.',
    device: 'mobile',
    annotation: 'Service Status',
  },
  {
    num: '03',
    title: 'Your Technician',
    description:
      'See who is working on your vessel, what they found, and what they did — with photo documentation at every stage, not just a final invoice.',
    device: 'desktop',
    annotation: 'Technician Assigned',
  },
  {
    num: '04',
    title: 'Full Transparency',
    description:
      'Photos, approvals, invoices, and direct communication — all in the same thread. Nothing about your service happens somewhere you can\'t see it.',
    device: 'mobile',
    annotation: 'Documentation',
  },
  {
    num: '05',
    title: "Built for What's Next",
    description:
      'The same platform is being built to support connected vessel systems and future health monitoring — designed from day one so your service history becomes more valuable over time, not less.',
    device: 'desktop',
    annotation: 'Coming Soon',
  },
];
