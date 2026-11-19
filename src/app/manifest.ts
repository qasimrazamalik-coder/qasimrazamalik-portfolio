import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Qasim Raza Malik — AI & Backend Engineer',
    short_name: 'Qasim',
    start_url: '/',
    display: 'standalone',
    background_color: '#06070b',
    theme_color: '#06070b',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
