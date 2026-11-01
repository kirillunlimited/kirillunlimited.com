// Regenerates the images in src/static from the originals in ./source (yarn images):
// responsive hero images (AVIF + JPEG), the social preview, app icons and favicon.ico.
// The hero is cropped separately for landscape and portrait screens, see the <picture> in src/index.html.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Output root and original images
const OUT = 'src/static';
const HERO = 'source/hero.jpg';
const AVATAR = 'source/avatar.jpg';

// Focal point of the hero crops, relative to the image. Keep in sync with `object-position` in src/styles.css
const FOCUS_X = 0.68;
const FOCUS_Y = 0.4;

// Encoder settings
const AVIF = { quality: 55 };
const JPEG = { quality: 75, mozjpeg: true };
const PNG = { palette: true, quality: 90, effort: 10 };

// Size of the original hero
const hero = sharp(HERO);
const { width, height } = await hero.metadata();

// Cuts `region` out of the hero and writes it as AVIF and JPEG at every width in `widths` (never upscaled).
// Pre-cropped to the aspect ratio the hero is displayed at, so no pixels are wasted
async function variants(name, region, widths) {
  const crop = sharp(HERO).extract(region);
  for (const w of widths) {
    const img = crop.clone().resize({ width: w, withoutEnlargement: true });
    await img.clone().avif(AVIF).toFile(`${OUT}/img/${name}-${w}.avif`);
    await img.clone().jpeg(JPEG).toFile(`${OUT}/img/${name}-${w}.jpg`);
  }
}

// Landscape: 4:1
const lh = Math.round(width / 4);
await variants('hero-landscape', { left: 0, top: Math.round((height - lh) * FOCUS_Y), width, height: lh }, [
  480,
  800,
  1200,
  1600,
  width,
]);

// Portrait: 4:3
const pw = Math.round((height * 4) / 3);
await variants('hero-portrait', { left: Math.round((width - pw) * FOCUS_X), top: 0, width: pw, height }, [
  480,
  800,
  pw,
]);

// Social preview (og:image, twitter:image): 1200x630, i.e. 1.91:1
const ow = Math.round(height * 1.91);
await sharp(HERO)
  .extract({ left: Math.round((width - ow) * FOCUS_X), top: 0, width: ow, height })
  .resize(1200, 630)
  .jpeg(JPEG)
  .toFile(`${OUT}/img/og.jpg`);

// Icons: the full frame of the avatar. 180px is the apple-touch-icon, 192px is the PNG favicon
await sharp(AVATAR).resize(180, 180).png(PNG).toFile(`${OUT}/img/avatar-180.png`);
await sharp(AVATAR).resize(192, 192).png(PNG).toFile(`${OUT}/img/favicon-192.png`);

// favicon.ico: a plain ICO container (header, directory, PNG images) built by hand, since sharp cannot write ICO
const sizes = [16, 32, 48, 64, 128, 256];
const pngs = await Promise.all(
  sizes.map((s) => sharp(AVATAR).resize(s, s).png({ compressionLevel: 9, effort: 10 }).toBuffer())
);
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((s, i) => {
  const o = 6 + i * 16;
  head[o] = head[o + 1] = s === 256 ? 0 : s;
  head.writeUInt16LE(1, o + 4);
  head.writeUInt16LE(32, o + 6);
  head.writeUInt32LE(pngs[i].length, o + 8);
  head.writeUInt32LE(offset, o + 12);
  offset += pngs[i].length;
});
await writeFile(`${OUT}/favicon.ico`, Buffer.concat([head, ...pngs]));
