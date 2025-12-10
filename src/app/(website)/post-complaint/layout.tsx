import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Complaint - Share Your Trading Experience",
  description: "Submit your complaint about prop trading firms. Help the trading community make informed decisions by sharing your experiences with funding, payouts, and trading conditions.",
  keywords: ["submit review", "prop firm review", "trading review", "share experience", "trader feedback", "complaints", "submit complaint", "file complaint", "prop firm complaint", "trading complaint"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/post-complaint",
    siteName: "My Forex Firms",
    title: "Submit a Complaint - Share Your Trading Experience",
    description: "Submit your complaint about prop trading firms. Help the trading community make informed decisions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Submit a Complaint - My Forex Firms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit a Complaint - Share Your Trading Experience",
    description: "Submit your complaint about prop trading firms. Help the trading community make informed decisions.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/post-complaint",
  },
};

export default function PostReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

