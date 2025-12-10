import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Complaints - Manage Your Submissions",
  description: "View and manage all your submitted prop trading firm complaints. Track the status of your complaints and see how they help the trading community.",
  keywords: ["my reviews", "review management", "submitted reviews", "trading reviews", "review status", "complaints", "my complaints", "complaint management", "complaint status", "prop firm complaints"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/complaints",
    siteName: "My Forex Firms",
    title: "My Complaints - Manage Your Submissions",
    description: "View and manage all your submitted prop trading firm complaints. Track the status of your complaints.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Reviews - My Forex Firms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Complaints - Manage Your Submissions",
    description: "View and manage all your submitted prop trading firm complaints.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/complaints",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

