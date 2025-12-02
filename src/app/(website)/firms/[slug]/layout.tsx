import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import FundingFirm from "@/models/FirmDetails";

interface FirmLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: FirmLayoutProps
): Promise<Metadata> {
  try {
    await connectDB();
    const { slug } = await params;

    const firm = await FundingFirm.findOne({
      "firmDetails.slug": slug,
    });

    if (!firm) {
      return {
        title: "Firm Not Found",
        description: "The requested prop trading firm could not be found.",
      };
    }

    const firmName = firm.firmDetails?.name || "Prop Trading Firm";
    const description = firm.firmDetails?.companyDescription 
      ? firm.firmDetails.companyDescription.substring(0, 160)
      : `Complete review and analysis of ${firmName}. Discover funding options, trading rules, payout structures, and trader reviews.`;
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myforexfirms.com";
    const firmUrl = `${siteUrl}/firms/${slug}`;
    const imageUrl = firm.firmDetails?.image?.url 
      ? firm.firmDetails.image.url 
      : `${siteUrl}/og-image.png`;

    const trustScore = firm.ratings?.trustPilotRating 
      ? `${firm.ratings.trustPilotRating}/5` 
      : "Verified";

    return {
      title: `${firmName} Review - Complete Analysis & Ratings`,
      description: description,
      keywords: [
        firmName,
        `${firmName} review`,
        "prop trading firm",
        "forex firm",
        "funded trading",
        "trading challenge",
        firm.firmDetails?.jurisdiction || "",
      ].filter(Boolean),
      authors: [{ name: "My Forex Firms" }],
      openGraph: {
        type: "website",
        locale: "en_US",
        url: firmUrl,
        siteName: "My Forex Firms",
        title: `${firmName} Review - Complete Analysis & Ratings`,
        description: description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${firmName} - Prop Trading Firm Review`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${firmName} Review - Complete Analysis & Ratings`,
        description: description,
        images: [imageUrl],
        creator: "@myforexfirms",
      },
      alternates: {
        canonical: firmUrl,
      },
    };
  } catch (error) {
    return {
      title: "Firm Review",
      description: "Complete review and analysis of prop trading firms.",
    };
  }
}

export default function FirmLayout({ children }: FirmLayoutProps) {
  return <>{children}</>;
}

