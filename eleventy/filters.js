import { DateTime } from 'luxon';

export const postDate = (dateObj) => DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy');
