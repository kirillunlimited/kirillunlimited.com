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
      class: imgClassName,
      width: largestUnoptimizedImg.width,
      height: largestUnoptimizedImg.height,
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

  imageShortcode: async (src, format, widths = ['auto']) => {
    const imageMetadata = await Image(src, {
      outputDir: `${constants.outputDir}/assets/img`,
      urlPath: '/assets/img',
      formats: [format],
      widths,
    });
    return imageMetadata[format][0].url;
  },

  logoShortcode: async (src, widths = [64, 128]) => {
    return commonPictureHandler(src, 'Logo', widths, ['webp', 'jpeg'], 'logo__picture', 'logo__pictureImg', '64px');
  },

  pictureShortcode: async (
    src,
    alt,
    isAi = false,
    float = undefined,
    widths = [360, 640, 800, 1200, 1600, 2000],
    formats = ['webp', 'jpeg']
  ) => {
    let pictureClassName = 'picture';
    let sizes = '(orientation: portrait) 90vw, 80vw';

    if (isAi) {
      pictureClassName += ` picture--ai`;
    }

    if (float) {
      pictureClassName += ` picture--${float}`;
      sizes = '(max-width: 1600px) 30vw, 320px';
      widths = [360, 640, 800];
    }

    return commonPictureHandler(src, alt, widths, formats, pictureClassName, 'picture__image', sizes);
  },

  ogImageUrlShortcode: async(apiScreenshotUrl, siteUrl, pageUrl, hash) => {
    const encodedPath = encodeURIComponent(`${siteUrl}/og${pageUrl.slice(0, -1)}`);
    return `${apiScreenshotUrl}/${encodedPath}/opengraph/_${hash}_wait:2`;
  },
};
