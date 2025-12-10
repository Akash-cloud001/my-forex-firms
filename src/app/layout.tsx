import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "My Forex Firms",
    template: "%s | My Forex Firms",
  },
  description: "Transparency, Verified Ratings, and Traders Trust. Discover verified prop trading firms, read honest reviews, and make informed decisions about funded trading accounts.",
  keywords: ["prop trading", "forex firms", "funded trading", "prop firms", "trading reviews", "forex reviews", "funded accounts", "complaints", "prop firm complaints", "trading complaints", "complaint submission"],
  authors: [{ name: "My Forex Firms" }],
  creator: "My Forex Firms",
  publisher: "My Forex Firms",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://myforexfirms.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "My Forex Firms",
    title: "My Forex Firms - Transparency, Verified Ratings, and Traders Trust",
    description: "Discover verified prop trading firms, read honest reviews, and make informed decisions about funded trading accounts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Forex Firms - Prop Trading Firm Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Forex Firms - Transparency, Verified Ratings, and Traders Trust",
    description: "Discover verified prop trading firms, read honest reviews, and make informed decisions about funded trading accounts.",
    images: ["/og-image.png"],
    creator: "@myforexfirms",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google tag (gtag.js) */}
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-XLCN99SMD9" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-XLCN99SMD9');
          `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${inter.variable} antialiased bg-background`}
        >
          <Providers>

            <main className="w-full min-h-screen">
              {children}

            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
