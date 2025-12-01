import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap | My Forex Firms",
  description: "Explore all pages, prop trading firms, and blog posts on My Forex Firms. Find comprehensive reviews, ratings, and trading insights.",
  keywords: ["sitemap", "prop trading firms", "forex firms", "trading reviews", "funded accounts"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/site-map",
    siteName: "My Forex Firms",
    title: "Sitemap | My Forex Firms",
    description: "Explore all pages, prop trading firms, and blog posts on My Forex Firms.",
  },
  twitter: {
    card: "summary",
    title: "Sitemap | My Forex Firms",
    description: "Explore all pages, prop trading firms, and blog posts on My Forex Firms.",
  },
  alternates: {
    canonical: "/site-map",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
