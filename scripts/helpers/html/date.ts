const getLastUpdateDate = (): string => process.env.CF_PAGES_COMMIT_TIMESTAMP || new Date().toISOString();

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

export const renderDate = () => {
  const iso = getLastUpdateDate();
  const formatted = formatDate(iso);
  return `<time datetime="${iso}">${formatted}</time>`;
};
