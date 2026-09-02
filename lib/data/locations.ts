// TEMPORARY DATA SOURCE — stand-in for the Sanity `location` schema.
// Structure prepared for future expansion to region/city/marina level
// without changing the shape — just adding more entries.

export interface LocationData {
  slug: string;
  country: string;
  primaryCity: string;
  coordinates: string;
  isServiceRegionOnly: boolean; // true = no physical office, service coverage only
  description: string;
  servicesAvailable: string[]; // service slugs, references lib/data/services.ts
}

export const LOCATIONS: LocationData[] = [
  {
    slug: 'united-states',
    country: 'United States',
    primaryCity: 'Miami, FL',
    coordinates: '25.77° N, 80.19° W',
    isServiceRegionOnly: true,
    description: 'Serving boat owners and marine partners across South Florida and surrounding waters.',
    servicesAvailable: ['marine-electrical', 'marine-electronics', 'diagnostics', 'navigation-gps', 'audio-systems', 'lighting', 'batteries-charging', 'pumps-bilge', 'custom-installations'],
  },
  {
    slug: 'dominican-republic',
    country: 'Dominican Republic',
    primaryCity: 'Santo Domingo',
    coordinates: '18.48° N, 69.93° W',
    isServiceRegionOnly: true,
    description: 'Serving boat owners and marine partners in Santo Domingo and the surrounding coast.',
    servicesAvailable: ['marine-electrical', 'diagnostics', 'batteries-charging'],
  },
  {
    slug: 'panama',
    country: 'Panama',
    primaryCity: 'Panama City',
    coordinates: '8.98° N, 79.52° W',
    isServiceRegionOnly: true,
    description: 'Serving boat owners and marine partners in Panama City and along the Pacific coast.',
    servicesAvailable: ['marine-electrical', 'marine-electronics', 'navigation-gps'],
  },
  {
    slug: 'colombia',
    country: 'Colombia',
    primaryCity: 'Cali',
    coordinates: '3.45° N, 76.53° W',
    isServiceRegionOnly: true,
    description: 'Serving boat owners and marine partners across the Colombian Pacific region.',
    servicesAvailable: ['marine-electrical', 'diagnostics'],
  },
];

export function getLocationBySlug(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}
