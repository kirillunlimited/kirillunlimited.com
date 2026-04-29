import { DateTime } from 'luxon';
import fs from 'fs/promises';
import { minify } from 'terser';

export const postDate = (dateObj) => DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy');
export const jsmin = async (filePath) => {
  const code = await fs.readFile(filePath, 'utf-8');

  const result = await minify(code, {
    compress: true,
    mangle: true,
  });

  return result.code;
};
