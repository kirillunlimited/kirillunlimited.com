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

const commonPictureHandler = async (src, alt, widths, formats, pictureClassName, imgClassName, sizes) => {
  const imageMetadata = await Image(src, {
    widths,
    formats,
    outputDir: `${constants.outputDir}/assets/img`,
    urlPath: '/assets/img',
  });

  const sourceHtmlString = Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((images) => {
      // The first entry is representative of all the others
      // since they each have the same shape
      const { sourceType } = images[0];

      // Use our util from earlier to make our lives easier
      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        // srcset needs to be a comma-separated attribute
        srcset: images.map((image) => image.srcset).join(', '),
        sizes: sizes || '100vw',
      });

      // Return one <source> per format
      return `<source ${sourceAttributes}>`;
    })
    .join('\n');

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  };

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    alt,
    class: imgClassName,
    loading: 'lazy',
    decoding: 'async',
  });
  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: pictureClassName,
  });
  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
  </picture>`;

  return outdent`${picture}`;
};

module.exports = {
  webpack: async (name) =>
    new Promise((resolve) => {
      fs.readFile(constants.manifestPath, { encoding: 'utf8' }, (err, data) =>
        resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
      );
    }),

  imageShortcode: async (src, extension) => {
    const ext = extension || src.split('.').slice(-1);
    const imageMetadata = await Image(src, {
      outputDir: `${constants.outputDir}/assets/img`,
      urlPath: '/assets/img',
      formats: [ext],
    });

    return imageMetadata[ext][0].url;
  },

  logoShortcode: async (src) => {
    return commonPictureHandler(src, 'Logo', [64], ['webp', 'jpeg'], 'logo__picture', 'logo__pictureImg');
  },

  pictureShortcode: async (
    src,
    alt,
    float = undefined,
    widths = [360, 640, 800, 1200, 1600, 2000],
    formats = ['webp', 'jpeg']
  ) => {
    let pictureClassName = 'picture';
    let sizes = '(orientation: portrait) 90vw, 80vw';

    if (float) {
      const floatName = `picture--${float}`;
      pictureClassName += ` ${floatName}`;
      sizes = '(max-width: 1600px) 30vw, 320px';
      widths = [360, 640, 800];
    }

    return commonPictureHandler(src, alt, widths, formats, pictureClassName, 'picture__image', sizes);
  },
};
