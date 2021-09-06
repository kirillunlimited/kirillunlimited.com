const lightStyles = document.querySelectorAll('link[rel=stylesheet][data-theme="light"]');
const darkStyles = document.querySelectorAll('link[rel=stylesheet][data-theme="dark"]');
const themeSelect = document.querySelector('.theme-select');
const THEMES = {
  LIGHT: 'light',
  AUTO: 'auto',
  DARK: 'dark',
};
const LOCAL_STORAGE_KEY = 'theme';
const ACTIVE_BUTTON_CLASS = 'active';
const THEME_BUTTONS = {
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
  let lightMedia;
  let darkMedia;

  if (theme === THEMES.AUTO) {
    lightMedia = '(prefers-color-scheme: light)';
    darkMedia = '(prefers-color-scheme: dark)';
  } else {
    lightMedia = theme === THEMES.LIGHT ? 'all' : 'not all';
    darkMedia = theme === THEMES.DARK ? 'all' : 'not all';
  }

  [...lightStyles].forEach((link) => {
    link.media = lightMedia;
  });

  [...darkStyles].forEach((link) => {
    link.media = darkMedia;
  });
};

export const setupTheme = () => {
  const savedTheme = getSavedTheme();
  savedTheme && THEME_BUTTONS[savedTheme].classList.add(ACTIVE_BUTTON_CLASS);
  themeSelect.addEventListener('click', ({ target }) => {
    const theme = target.getAttribute('data-theme');
    if (theme) {
      setTheme(theme);

      const activeThemeButton = themeSelect.querySelector(`.${ACTIVE_BUTTON_CLASS}`);
      activeThemeButton.classList.remove(ACTIVE_BUTTON_CLASS);
      THEME_BUTTONS[theme].classList.add(ACTIVE_BUTTON_CLASS);
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
