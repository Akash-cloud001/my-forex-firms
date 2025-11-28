import type { Metadata } from "next";
import firmReviewsData from '@/data/firm-reviews.json';
import { FirmReviewsData } from '@/types/firm-review';

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: BlogLayoutProps
): Promise<Metadata> {
  const { slug } = await params;
  const blogData = (firmReviewsData as FirmReviewsData)[slug];

  if (!blogData) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myforexfirms.com";
  const blogUrl = `${siteUrl}/blogs/${slug}`;
  const description = blogData.introduction || `${blogData.title} - ${blogData.subtitle}`;
  const imageUrl = blogData.overview?.data?.left?.find(item => item.label === "Firm Name:") 
    ? `${siteUrl}/website/firm/${slug}.png` 
    : `${siteUrl}/og-image.png`;

  return {
    title: blogData.title,
    description: description.substring(0, 160),
    keywords: [
      blogData.firmName,
      "prop trading",
      "forex firm review",
      "funded trading",
      blogData.firmName + " review",
      "trading review",
    ],
    authors: [{ name: "My Forex Firms" }],
    openGraph: {
      type: "article",
      locale: "en_US",
      url: blogUrl,
      siteName: "My Forex Firms",
      title: blogData.title,
      description: description.substring(0, 160),
      publishedTime: blogData.publishedAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${blogData.firmName} Review - ${blogData.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blogData.title,
      description: description.substring(0, 160),
      images: [imageUrl],
      creator: "@myforexfirms",
    },
    alternates: {
      canonical: blogUrl,
    },
  };
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return <>{children}</>;
}

