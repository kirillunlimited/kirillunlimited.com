const fs = require('fs');
const outdent = require('outdent');
const Image = require('@11ty/eleventy-img');
const constants = require('./constants');

const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

const generatePicture = async ({ src, alt, widths, formats, pictureClassNames, imgClassNames, sizes }) => {
  const pictureClassNamesString = pictureClassNames.join(' ');
  const imageClassNamesString = imgClassNames.join(' ');
  const imageMetadata = await Image(src, {
    widths,
    formats,
    outputDir: `${constants.outputDir}/assets/img`,
    urlPath: '/assets/img',
  });

  const sourceHtmlString = Object.values(imageMetadata)
    .map((images) => {
      const { sourceType } = images[0];
      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        srcset: images.map((image) => image.srcset).join(', '),
        sizes: sizes || '100vw',
      });

      return `<source ${sourceAttributes}>`;
    })
    .join(' ');

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  };

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    alt,
    class: imageClassNamesString,
    width: largestUnoptimizedImg.width,
    height: largestUnoptimizedImg.height,
    decoding: 'async',
  });
  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: pictureClassNamesString,
  });
  const picture = `<picture ${pictureAttributes}>
      ${sourceHtmlString}
      ${imgHtmlString}
    </picture>`;

  return outdent`${picture}`;
};

const imagePath = async (src, format, widths = ['auto']) => {
  const imageMetadata = await Image(src, {
    outputDir: `${constants.outputDir}/assets/img`,
    urlPath: '/assets/img',
    formats: [format],
    widths,
  });
  return imageMetadata[format][0].url;
};

const imageUrl = async (src, format, widths) => {
  const path = await imagePath(src, format, widths);
  return `${constants.siteUrl}/${path}`;
};

const logo = async (src, widths = [64, 128]) => {
  return generatePicture({
    src,
    alt: 'Logo',
    widths,
    formats: ['webp', 'jpeg'],
    pictureClassNames: ['logo__picture'],
    imgClassNames: ['logo__pictureImg'],
    sizes: '64px',
  });
};

const picture = async (
  src,
  alt,
  isAi = false,
  float = undefined,
  widths = [360, 640, 800, 1200, 1600, 2000],
  formats = ['webp', 'jpeg']
) => {
  let pictureClassNames = ['picture'];
  let sizes = '(orientation: portrait) 90vw, 80vw';

  if (isAi) {
    pictureClassNames.push('picture--ai');
  }

  if (float) {
    pictureClassNames.push('picture--${float}');
    sizes = '(max-width: 1600px) 30vw, 320px';
    widths = [360, 640, 800];
  }

  return generatePicture({ src, alt, widths, formats, pictureClassNames, imgClassNames: ['picture__image'], sizes });
};

const webpack = async (name) =>
  new Promise((resolve) => {
    fs.readFile(constants.manifestPath, { encoding: 'utf8' }, (err, data) =>
      resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
    );
  });

module.exports = {
  imagePath,
  imageUrl,
  logo,
  picture,
  webpack,
};
