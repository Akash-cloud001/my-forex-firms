import type { Metadata } from "next";
import { FirmReviewsData } from '@/types/firm-review';

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: BlogLayoutProps
): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myforexfirms.com";

  try {
    // ✅ Use full URL instead of relative path
    const apiUrl = `${siteUrl}/api/public/firm-reviews/${slug}`;
    
    const res = await fetch(apiUrl, {
      cache: "no-store",
    });

    // ✅ Explicitly check for errors
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.success || !data.review) {
      throw new Error("Invalid response format");
    }

    const blog = data.review;
    console.log(blog.title, " :: blog.title")
    console.log(blog.introduction?.substring(0, 160) || blog.subtitle, " :: blog.introduction?.substring(0, 160) || blog.subtitle")
    console.log(blog.firmName, " :: blog.firmName")
    console.log(blog.publishedAt, " :: blog.publishedAt")
    console.log(blog.seoTags, " :: blog.seoTags")
    return {
      title: blog.title,
      description: blog.introduction?.substring(0, 160) || blog.subtitle,
      keywords: blog.seoTags,
      authors: [{ name: "My Forex Firms" }],
      openGraph: {
        type: "article",
        locale: "en_US",
        url: `${siteUrl}/blogs/${slug}`,
        siteName: "My Forex Firms",
        title: blog.title,
        description: blog.introduction?.substring(0, 160) || blog.subtitle,
        publishedTime: blog.publishedAt,
        images: [
          {
            url: `${siteUrl}/website/firm/${slug}.png`,
            width: 1200,
            height: 630,
            alt: `${blog.firmName} Review`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.introduction?.substring(0, 160) || blog.subtitle,
        images: [`${siteUrl}/website/firm/${slug}.png`],
        creator: "@myforexfirms",
      },
      alternates: {
        canonical: `${siteUrl}/blogs/${slug}`,
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    
    return {
      title: `${slug.replace('-review', '')} Review | My Forex Firms`,
      description: "Honest and comprehensive prop firm review.",
    };
  }
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return <>{children}</>;
}
