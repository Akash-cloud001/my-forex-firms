import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reviews - Manage Your Submissions",
  description: "View and manage all your submitted prop trading firm reviews. Track the status of your reviews and see how they help the trading community.",
  keywords: ["my reviews", "review management", "submitted reviews", "trading reviews", "review status"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/reviews",
    siteName: "My Forex Firms",
    title: "My Reviews - Manage Your Submissions",
    description: "View and manage all your submitted prop trading firm reviews. Track the status of your reviews.",
    images: [
      {
        url: "/my-forex-firms-full.png",
        width: 1200,
        height: 630,
        alt: "My Reviews - My Forex Firms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Reviews - Manage Your Submissions",
    description: "View and manage all your submitted prop trading firm reviews.",
    images: ["/my-forex-firms-full.png"],
  },
  alternates: {
    canonical: "/reviews",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

