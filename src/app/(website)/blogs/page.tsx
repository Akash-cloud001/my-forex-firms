import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/website/AnimatedSection";

export const metadata: Metadata = {
  title: "Blog - Trading Insights & Prop Firm Reviews",
  description: "Discover the latest insights, guides, and comprehensive reviews of prop trading firms. Written by traders for traders.",
  keywords: ["trading blog", "prop firm reviews", "forex guides", "trading strategies", "funded trading", "trading insights"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/blogs",
    siteName: "My Forex Firms",
    title: "Blog - Trading Insights & Prop Firm Reviews",
    description: "Discover the latest insights, guides, and comprehensive reviews of prop trading firms. Written by traders for traders.",
    images: [
      {
        url: "/my-forex-firms-full.png",
        width: 1200,
        height: 630,
        alt: "My Forex Firms Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Trading Insights & Prop Firm Reviews",
    description: "Discover the latest insights, guides, and comprehensive reviews of prop trading firms.",
    images: ["/my-forex-firms-full.png"],
  },
  alternates: {
    canonical: "/blogs",
  },
};

const blogPosts = [
  {
    id: "b1",
    title: "How MyForexFirms Works",
    description:
      "Understand the complete lifecycle of getting funded with MyForexFirms, from evaluation to profit splits.",
    category: "Guides",
    image: "/website/blog-1-bg.png",
  },
  {
    id: "b2",
    title: "2025 Prop Firm Comparison",
    description:
      "A deep dive into the top prop firms of 2025, their payout structures, and trader sentiment.",
    category: "Research",
    image: "/website/blog-2-bg.png",
  },
  {
    id: "b3",
    title: "Psychology Of Funded Trading",
    description:
      "Practical insights on managing emotions, risk, and expectations when trading firm capital.",
    category: "Mindset",
    image: "/website/blog-3-bg.png",
  },
  {
    id: "b4",
    title: "Risk Management Playbook",
    description:
      "Blueprint for protecting your account with detailed risk frameworks trusted by top performers.",
    category: "Strategy",
    image: "/website/blog-4-bg.png",
  },
  {
    id: "b5",
    title: "Passing Challenge Accounts",
    description:
      "Step-by-step guide to pass prop firm challenges faster without over-leveraging your trades.",
    category: "Guides",
    image: "/website/blog-2-bg.png",
  },
  {
    id: "b6",
    title: "Scaling Your Prop Portfolio",
    description:
      "How to manage multiple funded accounts, balance risk, and build consistent payouts.",
    category: "Playbooks",
    image: "/website/blog-3-bg.png",
  },
];

export default function BlogsPage() {
  return (
    <AnimatedSection id="blogs-page">
        <section className="w-full bg-background py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-3">
                <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-white/60">
                    Insights &amp; Stories
                </p>
                <h1 className="gradient-text text-3xl sm:text-4xl lg:text-5xl font-semibold">
                    Discover The Latest From MyForexFirms
                </h1>
                <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base font-geist-sans">
                    Curated breakdowns, reviews, and strategies written by traders for
                    traders.
                </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                {blogPosts.map((post) => (
                    <article
                    key={post.id}
                    className="relative card-custom-grad rounded-[28px] overflow-hidden group"
                    >
                    <div className="absolute inset-0">
                        <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover object-center opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                        />
                    </div>
                    <div className="relative z-10 flex h-full flex-col justify-between bg-black/30 backdrop-blur-[2px] p-6 sm:p-8">
                        <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                            {post.category}
                        </p>
                        <h3 className="text-2xl font-semibold text-white font-geist-sans leading-tight">
                            {post.title}
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base font-light line-clamp-2">
                            {post.description}
                        </p>
                        </div>
                        <div className="flex items-center justify-end">
                        <Button
                            asChild
                            variant="ghost"
                            className="text-primary hover:text-white px-0"
                        >
                            <Link href={`/blogs/${post.id}`} className="flex items-center gap-2">
                            Read More
                            <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </Button>
                        </div>
                    </div>
                    </article>
                ))}
                </div>
            </div>
        </section>
    </AnimatedSection>
  );
}
