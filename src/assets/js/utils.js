const SCHEMES = {
  LIGHT: 'light',
  AUTO: 'auto',
  DARK: 'dark',
};
const LOCAL_STORAGE_KEY = 'scheme';
const ACTIVE_BUTTON_ATTRIBUTE = 'aria-current';

const lightStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="light"]');
const darkStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="dark"]');
const lightThemeColor = document.querySelector('meta[name=theme-color][data-color-scheme=light]');
const darkThemeColor = document.querySelector('meta[name=theme-color][data-color-scheme=dark]');

export const initColorScheme = () => {
  const scheme = getSavedColorScheme();
  switchMedia(scheme);
};

export const initColorSchemeControls = () => {
  const schemeSelect = document.querySelector('.scheme-select');
  const schemeButtons = {
    [SCHEMES.LIGHT]: schemeSelect?.querySelector(`button[data-scheme-value=${SCHEMES.LIGHT}`),
    [SCHEMES.AUTO]: schemeSelect?.querySelector(`button[data-scheme-value=${SCHEMES.AUTO}`),
    [SCHEMES.DARK]: schemeSelect?.querySelector(`button[data-scheme-value=${SCHEMES.DARK}`),
  };

  const savedScheme = getSavedColorScheme();
  savedScheme && schemeButtons[savedScheme].setAttribute(ACTIVE_BUTTON_ATTRIBUTE, 'true');

  schemeSelect.addEventListener('click', ({ target }) => {
    const scheme = target.getAttribute('data-scheme-value');
    if (scheme) {
      setColorScheme(scheme);

      /** Update scheme select buttons style */
      const activeSchemeButton = schemeSelect.querySelector(`[${ACTIVE_BUTTON_ATTRIBUTE}]`);
      activeSchemeButton.removeAttribute(ACTIVE_BUTTON_ATTRIBUTE);
      schemeButtons[scheme].setAttribute(ACTIVE_BUTTON_ATTRIBUTE, 'true');
    }
  });
};

const setColorScheme = (scheme) => {
  switchMedia(scheme);

  if (scheme === SCHEMES.AUTO) {
    resetSavedColorScheme();
    return;
  }

  saveColorScheme(scheme);
};

const switchMedia = (scheme) => {
  let lightMedia, darkMedia;

  switch (scheme) {
    case SCHEMES.AUTO:
      lightMedia = '(prefers-color-scheme: light)';
      darkMedia = '(prefers-color-scheme: dark)';
      break;
    case SCHEMES.LIGHT:
      lightMedia = 'all';
      darkMedia = 'not all';
      break;
    case SCHEMES.DARK:
      lightMedia = 'not all';
      darkMedia = 'all';
      break;
    default:
      break;
  }

  [lightStyles, lightThemeColor].forEach((element) => {
    element.media = lightMedia;
  });

  [darkStyles, darkThemeColor].forEach((element) => {
    element.media = darkMedia;
  });
};

const getSavedColorScheme = () => localStorage.getItem(LOCAL_STORAGE_KEY) || SCHEMES.AUTO;
const saveColorScheme = (scheme) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, scheme);
};
const resetSavedColorScheme = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
