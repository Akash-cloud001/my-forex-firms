import type { Metadata } from "next";
import React from 'react'

export const metadata: Metadata = {
  title: "Prop Trading Firms - Reviews & Ratings",
  description: "Browse verified prop trading firms. Read honest reviews, explore funding options, and find the best prop firm for your trading style.",
  keywords: ["prop trading firms", "forex firms", "funded trading", "prop firm reviews", "funded accounts", "trading firms"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/firms",
    siteName: "My Forex Firms",
    title: "Prop Trading Firms - Reviews & Ratings",
    description: "Browse verified prop trading firms. Read honest reviews, explore funding options, and find the best prop firm for your trading style.",
    images: [
      {
        url: "/my-forex-firms-full.png",
        width: 1200,
        height: 630,
        alt: "Prop Trading Firms - My Forex Firms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prop Trading Firms - Reviews & Ratings",
    description: "Browse verified prop trading firms. Read honest reviews and find the best prop firm for your trading style.",
    images: ["/my-forex-firms-full.png"],
  },
  alternates: {
    canonical: "/firms",
  },
};

const page = () => {
  return (
    <div>page</div>
  )
}

export default page