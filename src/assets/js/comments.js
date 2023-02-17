import { SCHEMES, getSavedColorScheme } from './color-scheme';

const initComments = () => {
  const scheme = getSavedColorScheme();

  const utterancesContainer = document.getElementById('utterances-container');

  if (!utterancesContainer) {
    return;
  }

  initUterrances(scheme, utterancesContainer);

  document.addEventListener('scheme-change', (event) => {
    const scheme = event.detail;
    setUtterancTheme(scheme);
  });
};

const getUtterancesThemeByScheme = (scheme) => {
  let theme = '';
  switch (scheme) {
    case SCHEMES.AUTO:
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'github-dark' : 'github-light';
      break;
    case SCHEMES.LIGHT:
      theme = 'github-light';
      break;
    case SCHEMES.DARK:
      theme = 'github-dark';
      break;
    default:
      break;
  }
  return theme;
};

const initUterrances = (scheme, utterancesContainer) => {
  const theme = getUtterancesThemeByScheme(scheme);
  const scriptElem = document.createElement('script');
  scriptElem.src = 'https://utteranc.es/client.js';
  scriptElem.async = true;
  scriptElem.crossOrigin = 'anonymous';
  scriptElem.setAttribute('repo', 'kirillunlimited/kirillunlimited.com');
  scriptElem.setAttribute('issue-term', 'title');
  scriptElem.setAttribute('label', 'blog-comment');
  scriptElem.setAttribute('theme', theme);
  utterancesContainer.appendChild(scriptElem);
};

const setUtterancTheme = (scheme) => {
  if (document.querySelector('.utterances-frame')) {
    let theme = getUtterancesThemeByScheme(scheme);

    if (!theme) {
      return;
    }

    const message = {
      type: 'set-theme',
      theme: theme,
    };
    const iframe = document.querySelector('.utterances-frame');
    iframe.contentWindow.postMessage(message, 'https://utteranc.es');
  }
};

initComments();
