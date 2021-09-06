const THEMES = {
  LIGHT: 'light',
  AUTO: 'auto',
  DARK: 'dark',
};

const themeSelector = document.querySelector('.theme-select');
const THEME_BUTTONS = {
  [THEMES.LIGHT]: document.querySelector(`[data-theme=${THEMES.LIGHT}`),
  [THEMES.AUTO]: document.querySelector(`[data-theme=${THEMES.AUTO}`),
  [THEMES.DARK]: document.querySelector(`[data-theme=${THEMES.DARK}`),
};
const ACTIVE_BUTTON_CLASS = 'active';

const metaThemeColor = document.querySelector('meta[name=theme-color]');
const THEME_ATTRIBUTES = {
  [THEMES.LIGHT]: {
    barColor: '#1976D2',
  },
  [THEMES.DARK]: {
    barColor: '#181818',
  },
};

const setTheme = (themeName) => {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
  THEME_ATTRIBUTES[themeName] &&
    metaThemeColor.setAttribute(
      'content',
      THEME_ATTRIBUTES[themeName].barColor
    );
};

export const initTheme = () => {
  const localStorageTheme = localStorage.getItem('theme');

  if (!localStorageTheme || localStorageTheme === THEMES.AUTO) {
    /** Check device's dark mode if theme has never been switched */
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(THEMES.DARK);
    }
  } else {
    if (localStorage.getItem('theme') === THEMES.DARK) {
      setTheme(THEMES.DARK);
    } else {
      setTheme(THEMES.LIGHT);
    }
  }
};

export const initThemeListener = () => {
  const theme = localStorage.getItem('theme') || THEMES.AUTO;
  THEME_BUTTONS[theme].classList.add(ACTIVE_BUTTON_CLASS);

  themeSelector.addEventListener('click', ({ target }) => {
    const theme = target.getAttribute('data-theme');
    if (theme) {
      const activeThemeButton = themeSelector.querySelector(
        `.${ACTIVE_BUTTON_CLASS}`
      );
      activeThemeButton.classList.remove(ACTIVE_BUTTON_CLASS);
      THEME_BUTTONS[theme].classList.add(ACTIVE_BUTTON_CLASS);
      setTheme(theme);
    }
  });
};
