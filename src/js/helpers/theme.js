/** CONSTANTS */
const THEMES = {
  LIGHT: 'light',
  AUTO: 'auto',
  DARK: 'dark',
};
const LOCAL_STORAGE_KEY = 'theme';
const ACTIVE_BUTTON_CLASS = 'active';

/** ELEMENTS */
const lightStyles = document.querySelectorAll('link[rel=stylesheet][data-scheme-colors="light"]');
const darkStyles = document.querySelectorAll('link[rel=stylesheet][data-scheme-colors="dark"]');
const lightThemeColor = document.querySelectorAll('meta[name=theme-color][data-theme-color=light]');
const darkThemeColor = document.querySelectorAll('meta[name=theme-color][data-theme-color=dark]');
const themeSelect = document.querySelector('.theme-select');
const themeButtons = {
  [THEMES.LIGHT]: themeSelect?.querySelector(`button[data-theme=${THEMES.LIGHT}`),
  [THEMES.AUTO]: themeSelect?.querySelector(`button[data-theme=${THEMES.AUTO}`),
  [THEMES.DARK]: themeSelect?.querySelector(`button[data-theme=${THEMES.DARK}`),
};

export const initTheme = () => {
  const savedTheme = getSavedTheme();
  switchMedia(savedTheme);
};

const setTheme = (theme) => {
  switchMedia(theme);

  if (theme === THEMES.AUTO) {
    clearSavedTheme();
    return;
  }

  saveTheme(theme);
};

const switchMedia = (theme) => {
  let lightMedia, darkMedia;

  if (theme === THEMES.AUTO) {
    lightMedia = '(prefers-color-scheme: light)';
    darkMedia = '(prefers-color-scheme: dark)';
  } else {
    lightMedia = theme === THEMES.LIGHT ? 'all' : 'not all';
    darkMedia = theme === THEMES.DARK ? 'all' : 'not all';
  }

  [...lightStyles, ...lightThemeColor].forEach((element) => {
    element.media = lightMedia;
  });

  [...darkStyles, ...darkThemeColor].forEach((element) => {
    element.media = darkMedia;
  });
};

export const setupTheme = () => {
  const savedTheme = getSavedTheme();
  savedTheme && themeButtons[savedTheme].classList.add(ACTIVE_BUTTON_CLASS);
  themeSelect.addEventListener('click', ({ target }) => {
    const theme = target.getAttribute('data-theme');
    if (theme) {
      setTheme(theme);

      const activeThemeButton = themeSelect.querySelector(`.${ACTIVE_BUTTON_CLASS}`);
      activeThemeButton.classList.remove(ACTIVE_BUTTON_CLASS);
      themeButtons[theme].classList.add(ACTIVE_BUTTON_CLASS);
    }
  });
};

const getSavedTheme = () => localStorage.getItem(LOCAL_STORAGE_KEY) || THEMES.AUTO;
const saveTheme = (theme) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, theme);
};
const clearSavedTheme = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
