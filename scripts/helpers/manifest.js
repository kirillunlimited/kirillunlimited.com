export function renderManifest({ commit }) {
  return {
    name: 'Kirill Ivanov',
    commit,
    icons: [
      {
        src: '/icons/avatar-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: '/icons/avatar-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  };
}
