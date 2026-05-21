import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Prontuários QP',
    short_name: 'Prontuários',
    description: 'Gerenciamento de prontuários médicos',
    start_url: '/busca',
    display: 'standalone',
    background_color: '#FAFAF9',
    theme_color: '#1D9E75',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
