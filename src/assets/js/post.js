import { initComments } from './helpers/comments';

if (!/HeadlessChrome/.test(window.navigator.userAgent)) {
  // Not headless
  initComments();
}
