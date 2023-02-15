import { initColorScheme, initColorSchemeControls } from './color-scheme';
import { initComments } from './comments';
import 'speedlify-score';

const scheme = initColorScheme();

document.addEventListener('DOMContentLoaded', () => {
  initColorSchemeControls();
  initComments(scheme);
});
