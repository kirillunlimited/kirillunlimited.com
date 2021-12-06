import { initScheme, setupScheme, initCurrentYear } from './utils';

initScheme();

document.addEventListener('DOMContentLoaded', function () {
  setupScheme();
  initCurrentYear();
});
