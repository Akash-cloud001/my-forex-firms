import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import FundingFirm from '@/models/FirmDetails';
// import FirmReviewModel from '@/models/FirmReview';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myforexfirms.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/firms`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Connect to database
    await connectDB();

    // Fetch all firm slugs
    const firms = await FundingFirm.find(
      { 'firmDetails.slug': { $exists: true, $ne: null } },
      { 'firmDetails.slug': 1, updatedAt: 1 }
    ).lean();

    const firmPages: MetadataRoute.Sitemap = firms.map((firm) => ({
      url: `${baseUrl}/firms/${firm.firmDetails?.slug}`,
      lastModified: firm.updatedAt ? new Date(firm.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Fetch all blog slugs
    // const blogs = await FirmReviewModel.find(
    //   { slug: { $exists: true, $ne: null } },
    //   { slug: 1, updatedAt: 1 }
    // ).lean();

    // const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    //   url: `${baseUrl}/blogs/${blog.slug}`,
    //   lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // }));

    // Combine all pages
    return [...staticPages, ...firmPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages if database connection fails
    return staticPages;
  }
}
