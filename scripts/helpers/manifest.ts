type Icon = {
  src: string;
  type: string;
  sizes: string;
};

export type WebManifest = {
  name: string;
  commit: string;
  icons: Icon[];
};

type RenderManifestInput = {
  commit: string;
};

export function renderManifest({ commit }: RenderManifestInput): WebManifest {
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
