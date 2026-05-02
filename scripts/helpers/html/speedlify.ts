export const renderSpeedlify = (hash: string): string => {
  const base = 'https://kirillunlimited-speedlify.netlify.app';

  return `
    <a
      href="${base}/kirillunlimited.com/#site-${hash}"
      target="_blank"
      rel="noopener noreferrer"
      class="footer__speedlify"
    >
      <speedlify-score
        speedlify-url="${base}"
        hash="${hash}"
      ></speedlify-score>
    </a>
  `;
};
