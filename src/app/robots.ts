import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/checkout',
        '/orders/',
        '/orders',
        '/login',
        '/signup',
        '/Whichlist',
        '/wishlist',
      ],
    },
    sitemap: 'https://aciagro.com/sitemap.xml',
  };
}
