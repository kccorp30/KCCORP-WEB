import { localeString } from './objects/localeString';
import { localeText } from './objects/localeText';
import { localeBlockContent } from './objects/localeBlockContent';
import { seo } from './objects/seo';
import { mediaAsset } from './objects/mediaAsset';

import { service } from './documents/service';
import { project } from './documents/project';
import { author } from './documents/author';
import { insight } from './documents/insight';
import { testimonial } from './documents/testimonial';
import { location } from './documents/location';
import { technologyContent } from './documents/technologyContent';
import { landingPage } from './documents/landingPage';
import { partner } from './documents/partner';

import { homepage } from './singletons/homepage';
import { navigation } from './singletons/navigation';
import { footer } from './singletons/footer';
import { globalSettings } from './singletons/globalSettings';

export const schemaTypes = [
  // objects (reusable, no direct Studio entry)
  localeString,
  localeText,
  localeBlockContent,
  seo,
  mediaAsset,
  // content documents
  service,
  project,
  author,
  insight,
  testimonial,
  location,
  technologyContent,
  landingPage,
  partner,
  // singletons
  homepage,
  navigation,
  footer,
  globalSettings,
];
