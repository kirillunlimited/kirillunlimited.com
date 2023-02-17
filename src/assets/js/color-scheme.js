export const SCHEMES = {
  LIGHT: 'light',
  AUTO: 'auto',
  DARK: 'dark',
};
const LOCAL_STORAGE_KEY = 'scheme';

const lightStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="light"]');
const darkStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="dark"]');
const lightThemeColor = document.querySelector('meta[name=theme-color][data-color-scheme=light]');
const darkThemeColor = document.querySelector('meta[name=theme-color][data-color-scheme=dark]');

export const initColorScheme = () => {
  const scheme = getSavedColorScheme();
  switchMedia(scheme);
};

export const initColorSchemeControls = () => {
  const colorSchemeControls = document.querySelectorAll('input[name="scheme-select"]');
  const scheme = getSavedColorScheme();

  colorSchemeControls.forEach((control) => {
    if (control.value === scheme) {
      control.checked = true;
    }

    control.addEventListener('change', (event) => {
      setColorScheme(event.target.value);
    });
  });
};

const setColorScheme = (scheme) => {
  switchMedia(scheme);
  saveColorScheme(scheme);

  const event = new CustomEvent('scheme-change', { detail: scheme });
  document.dispatchEvent(event);
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

export const getSavedColorScheme = () => localStorage.getItem(LOCAL_STORAGE_KEY) || SCHEMES.AUTO;
const saveColorScheme = (scheme) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, scheme);
};
