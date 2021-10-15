import { setupScheme } from './helpers/scheme';
import { initAnalytics } from './helpers/analytics';

const initCurrentYear = () => {
  const currentYearElement = document.querySelector('#current-year');
  currentYearElement.innerHTML = new Date().getFullYear();
};

setupScheme();
initCurrentYear();
initAnalytics();
