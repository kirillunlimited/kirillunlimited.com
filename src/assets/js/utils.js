const SCHEMES = {
  LIGHT: 'light',
  AUTO: 'auto',
  DARK: 'dark',
};
const LOCAL_STORAGE_KEY = 'scheme';
const ACTIVE_BUTTON_ATTRIBUTE = 'aria-current';

const lightStyles = document.querySelectorAll('link[rel=stylesheet][data-scheme-colors="light"]');
const darkStyles = document.querySelectorAll('link[rel=stylesheet][data-scheme-colors="dark"]');
const lightThemeColor = document.querySelectorAll('meta[name=theme-color][data-theme-color=light]');
const darkThemeColor = document.querySelectorAll('meta[name=theme-color][data-theme-color=dark]');

export const initScheme = () => {
  const savedScheme = getSavedScheme();
  switchMedia(savedScheme);
};

export const setupScheme = () => {
  const schemeSelect = document.querySelector('.scheme-select');
  const schemeButtons = {
    [SCHEMES.LIGHT]: schemeSelect?.querySelector(`button[data-scheme-value=${SCHEMES.LIGHT}`),
    [SCHEMES.AUTO]: schemeSelect?.querySelector(`button[data-scheme-value=${SCHEMES.AUTO}`),
    [SCHEMES.DARK]: schemeSelect?.querySelector(`button[data-scheme-value=${SCHEMES.DARK}`),
  };

  const savedScheme = getSavedScheme();
  savedScheme && schemeButtons[savedScheme].setAttribute(ACTIVE_BUTTON_ATTRIBUTE, 'true');

  schemeSelect.addEventListener('click', ({ target }) => {
    const scheme = target.getAttribute('data-scheme-value');
    if (scheme) {
      setScheme(scheme);

      /** Update scheme select buttons style */
      const activeSchemeButton = schemeSelect.querySelector(`[${ACTIVE_BUTTON_ATTRIBUTE}]`);
      activeSchemeButton.removeAttribute(ACTIVE_BUTTON_ATTRIBUTE);
      schemeButtons[scheme].setAttribute(ACTIVE_BUTTON_ATTRIBUTE, 'true');
    }
  });
};

const setScheme = (scheme) => {
  switchMedia(scheme);

  if (scheme === SCHEMES.AUTO) {
    clearSavedScheme();
    return;
  }

  saveScheme(scheme);
};

const switchMedia = (scheme) => {
  let lightMedia, darkMedia;

  if (scheme === SCHEMES.AUTO) {
    lightMedia = '(prefers-color-scheme: light)';
    darkMedia = '(prefers-color-scheme: dark)';
  } else {
    lightMedia = scheme === SCHEMES.LIGHT ? 'all' : 'not all';
    darkMedia = scheme === SCHEMES.DARK ? 'all' : 'not all';
  }

  [...lightStyles, ...lightThemeColor].forEach((element) => {
    element.media = lightMedia;
  });

  [...darkStyles, ...darkThemeColor].forEach((element) => {
    element.media = darkMedia;
  });
};

const getSavedScheme = () => localStorage.getItem(LOCAL_STORAGE_KEY) || SCHEMES.AUTO;
const saveScheme = (scheme) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, scheme);
};
const clearSavedScheme = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const initCurrentYear = () => {
  const currentYearElement = document.querySelector('#current-year');
  currentYearElement.innerHTML = new Date().getFullYear();
};
