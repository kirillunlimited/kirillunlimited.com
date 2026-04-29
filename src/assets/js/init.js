(function () {
  const SCHEMES = {
    LIGHT: 'light',
    AUTO: 'auto',
    DARK: 'dark',
  };

  const scheme = localStorage.getItem('scheme') || SCHEMES.AUTO;

  const lightStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="light"]');
  const darkStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="dark"]');

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
  }

  if (lightStyles) lightStyles.media = lightMedia;
  if (darkStyles) darkStyles.media = darkMedia;
})();
