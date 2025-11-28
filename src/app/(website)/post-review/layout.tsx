import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Review - Share Your Trading Experience",
  description: "Share your honest review of prop trading firms. Help the trading community make informed decisions by sharing your experiences with funding, payouts, and trading conditions.",
  keywords: ["submit review", "prop firm review", "trading review", "share experience", "trader feedback"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/post-review",
    siteName: "My Forex Firms",
    title: "Submit a Review - Share Your Trading Experience",
    description: "Share your honest review of prop trading firms. Help the trading community make informed decisions.",
    images: [
      {
        url: "/my-forex-firms-full.png",
        width: 1200,
        height: 630,
        alt: "Submit a Review - My Forex Firms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit a Review - Share Your Trading Experience",
    description: "Share your honest review of prop trading firms. Help the trading community make informed decisions.",
    images: ["/my-forex-firms-full.png"],
  },
  alternates: {
    canonical: "/post-review",
  },
};

export default function PostReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

