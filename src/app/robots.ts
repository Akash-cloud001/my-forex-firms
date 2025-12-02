import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myforexfirms.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/sign-in/',
          '/sign-up/',
          '/profile/',
          '/post-review/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
