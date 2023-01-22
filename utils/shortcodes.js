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

module.exports = {
  webpack: async (name) =>
    new Promise((resolve) => {
      fs.readFile(constants.manifestPath, { encoding: 'utf8' }, (err, data) =>
        resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
      );
    }),

  imageShortcode: async (src, folder) => {
    const ext = src.split('.').slice(-1);
    const imageMetadata = await Image(src, {
      outputDir: `dist/assets/images/${folder}`,
      urlPath: `/assets/images/${folder}`,
      formats: [ext],
    });

    return imageMetadata[ext][0].url;
  },

  pictureShortcode: async (
    src,
    alt,
    float = undefined,
    widths = [400, 800, 1280],
    formats = ['webp', 'jpeg'],
    sizes = '100vw'
  ) => {
    const imageMetadata = await Image(src, {
      widths: [...widths, null],
      formats: [...formats, null],
      outputDir: 'dist/assets/images',
      urlPath: '/assets/images',
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
          sizes,
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
      class: ['picture__image'],
      loading: 'lazy',
      decoding: 'async',
    });
    const imgHtmlString = `<img ${imgAttributes}>`;

    let className = 'picture';
    if (float) {
      const floatName = `picture--${float}`;
      className += ` ${floatName}`;
    }
    const pictureAttributes = stringifyAttributes({
      class: className,
    });
    const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
  </picture>`;

    return outdent`${picture}`;
  },
};
