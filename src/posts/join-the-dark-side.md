---
title: Join the Dark Side
date: 2023-03-15
head:
  title: Join the Dark Side
  description: How to easily implement color scheme switching on a website.
speedlify: 9e29aad5
---

## Why you should be bothered by color schemes?

It is hard to deny that dark mode has been on a hype train for the last few years. Not only websites and apps started to allow users to choose desired color scheme, but also devices themselves cannot do without this feature. Some might assume, that it is only about aesthetics, but you should not forget about readability reasons: vast majority of users prefer to use the dark mode at dark time as it feels more comfortable for eyes.

## Scheme variables

First of all, let’s create separate `.css` files with the list of css-variables for each color scheme:

```css
:root {
  --background-color: white;
  --text-color: black;
}
```

```css
:root {
  --background-color: black;
  --text-color: white;
}
```

And use these variables wherever necessary:

```css
body {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

Note, that you shouldn’t place these variables into common styles bundle. Keep them in separate files and tell browser to choose the proper set of variables automatically according to the device’s color scheme. This behaviour can be achieved with [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media feature:

```html
<head>
  ...
  <link rel="stylesheet" href="css/light.css" media="(prefers-color-scheme: light)" />
  <link rel="stylesheet" href="css/dark.css" media="(prefers-color-scheme: dark)" />
  <link rel="stylesheet" href="css/styles.css" />
  ...
</head>
```

Now you can switch color mode in your device’s settings and see how page switch colors. Don’t forget to add `transition` property for every element on the page that depends on color scheme to improve user experience.

## Fallback

According to [Can I use](https://caniuse.com/?search=prefers-color-scheme), more than 95% of browsers already support [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme). If you care about the rest of the browsers, you should definitely come up with some fallback.

The simplest approach is just to inject light or dark scheme variables to your main css bundle so that your app could use them by default. The obvious drawback is that the same variables will be delivered twice for modern browsers: via your bundled css file and also via separate scheme-specific files. If you have a really huge amount of variables it might hurt performance a little bit.

Better solution is to check, if browser supports this feature with JavasScript. Otherwise, we will link CSS file with desired color scheme variables manually:

```jsx
if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="css/light.css">');
}
```

## Manual switching

But there is a plenty of users who prefer to choose certain color scheme instead of system’s default setup. We need to add a control for color scheme switching. It should be something like a group of radio buttons. Choose whatever you want and whatever suits your design guidelines. For simplicity, let’s use browser’s native radio buttons.

Most of the sites have only 2 modes: **light** and **dark**. But we want to not only allow to choose certain scheme, but also provide option to reset it to system’s default. So there should be 3 options: **light**, **dark** and **auto**:

```html
<body>
  ...
  <input type="radio" name="color-scheme" value="light" />
  <input type="radio" name="color-scheme" value="dark" />
  <input type="radio" name="color-scheme" value="auto" />
  ...
</body>
```

## Let’s dive into coding

We need to implement following steps:

1. Init page with proper color scheme
   1. If user has already toggled it manually, then apply it
   2. Otherwise, keep system’s default scheme
2. Init color scheme switch controls that will save user’s choice in future

Let’s add some extra data-attributes to CSS link tags to make it easier to find them with JavaScript later:

```html
<head>
  ...
  <link rel="stylesheet" href="css/light.css" media="(prefers-color-scheme: light)" data-color-scheme="light" />
  <link rel="stylesheet" href="css/dark.css" media="(prefers-color-scheme: dark)" data-color-scheme="dark" />
  ...
</head>
```

Let’s declare some constants with common data and references to CSS link tags:

```js
const SCHEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};
const LOCAL_STORAGE_KEY = 'scheme';
const lightStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="light"]');
const darkStyles = document.querySelector('link[rel=stylesheet][data-color-scheme="dark"]');
```

We need to remember user’s color scheme choice to be able to get this value on every page load. For this purpose we will use local storage. Let’s add some helper methods:

```js
const getSavedColorScheme = () => localStorage.getItem(LOCAL_STORAGE_KEY) || SCHEMES.AUTO;
const saveColorScheme = (scheme) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, scheme);
};
```

Let’s add a new method `switchMedia` that changes `media` content of each CSS link tag to tell the browser which color scheme to choose:

```js
const switchMedia = (scheme) => {
  switch (scheme) {
    case SCHEMES.LIGHT:
      lightStyles.media = 'all';
      darkStyles.media = 'not all';
      break;
    case SCHEMES.DARK:
      lightStyles.media = 'not all';
      darkStyles.media = 'all';
      break;
    case SCHEMES.AUTO:
      lightStyles.media = '(prefers-color-scheme: light)';
      darkStyles.media = '(prefers-color-scheme: dark)';
      break;
    default:
      break;
  }
};
```

Don’t forget to add an event listener to your color scheme switch control and set initial value:

```js
const initColorSchemeControls = () => {
  const scheme = getSavedColorScheme();

  const colorSchemeControls = document.querySelectorAll('input[name="color-scheme"]');

  colorSchemeControls.forEach((control) => {
    if (control.value === scheme) {
      control.checked = true;
    }

    control.addEventListener('change', (event) => {
      const value = event.target.value;

      switchMedia(value);
      saveColorScheme(value);
    });
  });
};
```

We are almost there. Now we just need to set the proper color scheme on page load with `initColorScheme` method:

```js
const initColorScheme = () => {
  const scheme = getSavedColorScheme();
  switchMedia(scheme);
};
```

We are done! Now we should call both `initColorScheme` and `initColorSchemeControls`. It should work like a charm.

## Flash of Inaccurate Color Theme

If you added all of the JavaScript code into the end of your HTML or added `async` attribute to your script tag, you would probably notice a little problem. If you select color scheme other than system’s default scheme, then on each page load there will be a [Flash of Inaccurate Color Theme](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/) which may worsen UX. It happens because browser fails to execute JavaScript code before the initial page load. You can solve this problem by simply adding your code at the top of your HTML document. It will block render until your JS code is completely executed. But don’t forget, that `initColorSchemeControls` should be called only after DOM is completely loaded:

```js
initColorScheme();

document.addEventListener('DOMContentLoaded', () => {
  initColorSchemeControls();
});
```

Be careful: this approach may affect First Contentful Paint, so you should keep this scheme setup script really tiny. Don’t load all of your JS bundle before page render. Or if you really don’t want to delay page render, you should probably use some server-side solution.

## Conclusion

That's it! Now we have some nasty and powerful color mode toggle mechanism. By default it delivers system’s preferred color scheme, but it also considers user’s choice. You can check the real-world example of this functionality in the [source code](https://github.com/kirillunlimited/kirillunlimited.com){target="\_blank" rel="noopener noreferrer"} of this website.
