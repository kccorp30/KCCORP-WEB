import createImageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: any) {
  return builder.image(source);
}
