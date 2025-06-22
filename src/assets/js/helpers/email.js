export const decodeEmailLink = () => {
  document.body.innerHTML = document.body.innerHTML.replace('__email__', 'mailto:kirillunlimited@gmail.com');
};
