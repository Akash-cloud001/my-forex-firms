"use client";

import React from 'react';
import Link from "next/link";
import { ArrowRightIcon, Calendar, Clock, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/website/AnimatedSection";
import { useBlogList } from "@/stores/blogStore";
import { Badge } from "@/components/ui/badge";

export default function BlogsPage() {
  const { blogs, isLoading, error, fetchBlogs, hasBlogs } = useBlogList();

  // Fetch blogs on mount
  React.useEffect(() => {
    if (!hasBlogs && !isLoading) {
      fetchBlogs();
    }
  }, [hasBlogs, isLoading, fetchBlogs]);
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

                {isLoading ? (
                    <div className="mt-12 flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading blogs...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="mt-12 flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-destructive mb-4">{error}</p>
                            <Button onClick={fetchBlogs}>Try Again</Button>
                        </div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="mt-12 flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">No blogs found.</p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                        {blogs.map((blog) => (
                            <article
                                key={blog.slug}
                                className="relative card-custom-grad rounded-[28px] overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 opacity-70 transition duration-500 group-hover:opacity-90" />
                                <div className="relative z-10 flex h-full flex-col justify-between bg-black/30 backdrop-blur-[2px] p-6 sm:p-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className="text-xs">
                                                {blog.firmName}
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                <span className="text-xs text-white/60">{blog.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-white font-geist-sans leading-tight">
                                            {blog.title}
                                        </h3>
                                        <p className="text-white/80 text-sm sm:text-base font-light line-clamp-2">
                                            {blog.subtitle}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-white/60">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{blog.publishedAt}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{blog.readTime} min read</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end mt-4">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="text-primary hover:text-white px-0"
                                        >
                                            <Link href={`/blogs/${blog.slug}`} className="flex items-center gap-2">
                                                Read More
                                                <ArrowRightIcon className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    </AnimatedSection>
  );
}
