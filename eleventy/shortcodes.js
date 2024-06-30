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

const generatePicture = async ({
  alt,
  decoding,
  formats = ['webp', 'jpeg'],
  imgClassNames,
  loading,
  pictureClassNames,
  sizes,
  src,
  widths,
}) => {
  const pictureClassNamesString = pictureClassNames.join(' ');
  const imageClassNamesString = imgClassNames.join(' ');
  const imageMetadata = await Image(src, {
    formats,
    outputDir: `${constants.outputDir}/assets/img`,
    urlPath: '/assets/img',
    widths,
  });

  const sourceHtmlString = Object.values(imageMetadata)
    .map((images) => {
      const { sourceType } = images[0];
      const sourceAttributes = stringifyAttributes({
        sizes: sizes || '100vw',
        srcset: images.map((image) => image.srcset).join(', '),
        type: sourceType,
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
    alt,
    class: imageClassNamesString,
    decoding,
    height: largestUnoptimizedImg.height,
    loading,
    src: largestUnoptimizedImg.url,
    width: largestUnoptimizedImg.width,
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
    formats: [format],
    outputDir: `${constants.outputDir}/assets/img`,
    urlPath: '/assets/img',
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
    alt: 'Logo',
    formats: ['webp', 'jpeg'],
    imgClassNames: ['logo__pictureImg'],
    pictureClassNames: ['logo__picture'],
    sizes: '64px',
    src,
    widths,
  });
};

const pagePicture = async (src, alt, widths = [360, 480, 640, 800, 1200, 1600, 2000]) => {
  let pictureClassNames = ['picture'];
  let sizes = ['(orientation: portrait) 90vw', '80vw'];

  return generatePicture({
    alt,
    imgClassNames: ['picture__image'],
    pictureClassNames,
    sizes: sizes.join(', '),
    src,
    widths,
  });
};

const postPicture = async (src, alt, widths = [360, 480, 640, 800, 1200, 1600, 2000]) => {
  let pictureClassNames = ['picture', 'picture--ai'];
  let sizes = ['(orientation: portrait) 90vw', '80vw'];

  return generatePicture({
    alt,
    imgClassNames: ['picture__image'],
    pictureClassNames,
    sizes: sizes.join(', '),
    src,
    widths,
  });
};

const postPreviewPicture = async (src, alt, outsideViewport, widths = [360, 480, 640, 800, 1200]) => {
  let pictureClassNames = ['picture'];
  let sizes = ['(orientation: portrait) 90vw', '40vw'];

  return generatePicture({
    alt,
    decoding: outsideViewport ? 'async' : undefined,
    imgClassNames: ['picture__image'],
    loading: outsideViewport ? 'lazy' : undefined,
    pictureClassNames,
    sizes: sizes.join(', '),
    src,
    widths,
  });
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
  pagePicture,
  postPicture,
  postPreviewPicture,
  webpack,
};
