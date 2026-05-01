import { DateTime } from 'luxon';
import fs from 'fs/promises';

export const postDate = (dateObj) => DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy');
