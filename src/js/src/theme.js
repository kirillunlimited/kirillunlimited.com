const themeSwitch = document.querySelector('#theme-switch')
const themeSwitchLabel = document.querySelector('#theme-switch-label')
const metaThemeColor = document.querySelector('meta[name=theme-color]')
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}
const THEME_ATTRIBUTES = {
  light: {
    barColor: '#1976D2',
    switchTitle: 'Темная тема',
  },
  dark: {
    barColor: '#181818',
    switchTitle: 'Светлая тема',
  },
}

function setTheme(themeName) {
  localStorage.setItem('theme', themeName)
  document.documentElement.className = themeName
  metaThemeColor.setAttribute('content', THEME_ATTRIBUTES[themeName].barColor)

  if (themeSwitchLabel) {
    themeSwitchLabel.title = THEME_ATTRIBUTES[themeName].switchTitle
  }
}

export const initTheme = function () {
  const localStorageTheme = localStorage.getItem('theme')

  if (!localStorageTheme) {
    /** If theme was never switched check device's dark mode */
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(THEMES.DARK)
    }
  } else {
    if (localStorage.getItem('theme') === THEMES.DARK) {
      setTheme(THEMES.DARK)
    } else {
      setTheme(THEMES.LIGHT)
    }
  }
}

export const initThemeListener = function () {
  const theme = localStorage.getItem('theme') || THEMES.LIGHT
  themeSwitch.checked = theme === THEMES.DARK
  themeSwitchLabel.title = THEME_ATTRIBUTES[theme].switchTitle

  themeSwitch.addEventListener('change', function (e) {
    if (e.currentTarget.checked === true) {
      setTheme(THEMES.DARK)
    } else {
      setTheme(THEMES.LIGHT)
    }
  })
}
