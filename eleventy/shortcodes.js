import fs from 'fs';
import Image from '@11ty/eleventy-img';
import { outputDir, manifestPath } from './constants.js';

export const imagePath = async (src, format, widths = ['auto']) => {
  const imageMetadata = await Image(src, {
    formats: [format],
    outputDir: `${outputDir}/assets/img`,
    urlPath: '/assets/img',
    widths,
  });
  return imageMetadata[format][0].url;
};
