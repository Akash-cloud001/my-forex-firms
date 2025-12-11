"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import AnimatedSection from "@/components/website/AnimatedSection";
import { useRouter } from "next/navigation";
import ScrollToTop from '@/components/website/ScrollToTop';
interface Firm {
  id: string;
  name: string;
  totalPayout: number | null;
  image: {
    url?: string;
    publicId?: string;
    thumbnail?: string;
  } | null;
  yearFounded: number | null;
  slug: string | null;
}

interface ApiResponse {
  success: boolean;
  data: Firm[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const FirmsPage = () => {
  const router = useRouter();
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "yearFounded">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [pagination, setPagination] = useState<ApiResponse["pagination"]>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchFirms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        sortBy: sortBy,
        order: sortOrder,
      });

      const response = await fetch(`/api/public/firm-list?${params}`);
      const result: ApiResponse = await response.json();

      if (result.success) {
        setFirms(result.data);
        setPagination(result.pagination);
      } else {
        setError("Failed to load firms");
      }
    } catch (err) {
      console.error("Error fetching firms:", err);
      setError("An error occurred while loading firms");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, pagination.limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  // Debounce search - reset to page 1 when search changes
  useEffect(() => {
    if (search === "") {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    // Parse the value: "name-asc", "name-desc", "yearFounded-asc", "yearFounded-desc"
    const [field, order] = value.split('-') as [("name" | "yearFounded"), ("asc" | "desc")];
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sort changes
    // fetchFirms will be called automatically via useEffect
  };

  const getCurrentSortValue = () => {
    return `${sortBy}-${sortOrder}`;
  };

  const getSortDisplayText = () => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? "Name (A-Z)" : "Name (Z-A)";
    } else {
      return sortOrder === "asc" ? "Year (Oldest)" : "Year (Newest)";
    }
  };

  return (
    <section className="w-full bg-background pt-24 pb-16 sm:pb-24 min-h-screen">
      <ScrollToTop />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection id="firms-page-header">
          <div className="text-center space-y-3 mb-12">
            <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-foreground/60 font-geist-sans">
              Prop Trading Firms
            </p>
            <h1 className="gradient-text text-3xl sm:text-4xl lg:text-5xl font-semibold font-geist-sans">
              Discover The Best Prop Firms
            </h1>
            <p className="text-foreground/60 max-w-2xl mx-auto text-sm sm:text-base font-geist-sans">
              Browse and compare verified prop trading firms. Find the best funding opportunity for your trading style.
            </p>
          </div>
        {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Bar - Left */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  placeholder="Search firms by name..."
                  value={search}
                  onChange={handleSearchChange}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Filters - Right */}
            <div className="flex gap-3">
              {/* <Button
                variant="outline"
                className="bg-white/10 border-zinc-700 text-gray-400 hover:bg-zinc-900 hover:text-white rounded-full px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-zinc-700 text-gray-400 hover:bg-zinc-900 hover:text-white rounded-full px-6"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Sort {sortBy !== "name" || sortOrder !== "asc" ? `(${getSortDisplayText()})` : ""}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border text-foreground w-56"
                >
                  <DropdownMenuRadioGroup
                    value={getCurrentSortValue()}
                    onValueChange={handleSortChange}
                  >
                    <DropdownMenuRadioItem value="name-asc" className="font-geist-sans">
                      Firm Name (A-Z)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name-desc" className="font-geist-sans">
                      Firm Name (Z-A)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="yearFounded-asc" className="font-geist-sans">
                      Founded Year (Oldest First)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="yearFounded-desc" className="font-geist-sans">
                      Founded Year (Newest First)
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchFirms} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Firms Grid */}
        {!loading && !error && (
          <AnimatedSection id="firms-list" threshold={0}>
            {firms.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-foreground/60 mb-2">No firms found</p>
                  {search && (
                    <p className="text-sm text-foreground/40">
                      Try adjusting your search terms
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {firms.map((firm) => (
                    <Card
                      key={firm.id}
                      className="group min-w-[140px] w-full card-custom-grad duration-100 p-4 shrink-0 transition-colors cursor-pointer"
                      onClick={() => firm.slug && router.push(`/firms/${firm.slug}`)}
                    >
                      {/* Content in a row */}
                      <div className="h-auto flex flex-col items-left gap-3 rounded-2xl">
                        {/* Badge Icons */}
                        <div className="flex gap-10 w-full justify-between">
                          <div className="w-12 h-12 flex flex-col relative rounded-[4px] overflow-hidden">
                            <Image
                              src={firm.image?.thumbnail || firm.image?.url || "/website/firm/imagePlac.png"}
                              alt={firm.name}
                              fill
                              className="object-contain group-hover:scale-110 transition-all duration-300"
                            />
                          </div>
                          <div className="text-xs text-foreground/70 text-right max-w-[60px]">
                            Founded <span className="font-semibold text-sm">{firm.yearFounded}</span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between">
                          {/* Text Content */}
                          <div className="flex flex-col text-left">
                            <div className="text-base font-semibold truncate">{firm.name}</div>
                            <div className="text-xs text-foreground/70">
                              0 Reviews
                            </div>
                          </div>

                          <ArrowRight className="w-4 h-4 text-primary/70 -rotate-45 group-hover:rotate-0 group-hover:text-primary transition-all duration-300" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="border-border bg-card text-foreground disabled:opacity-50"
                      >
                        Previous
                      </Button>

                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first page, last page, current page, and pages around current
                          return (
                            page === 1 ||
                            page === pagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis
                          const prevPage = array[index - 1];
                          const showEllipsisBefore = prevPage && page - prevPage > 1;

                          return (
                            <React.Fragment key={page}>
                              {showEllipsisBefore && (
                                <span className="px-2 text-foreground/60">...</span>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => handlePageChange(page)}
                                className={`border-border ${page === currentPage
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card hover:bg-card/80 text-foreground'
                                  }`}
                              >
                                {page}
                              </Button>
                            </React.Fragment>
                          );
                        })}

                      <Button
                        variant="outline"
                        disabled={!pagination.hasNextPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="border-border bg-card text-foreground disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Results Count */}
                <div className="mt-8 text-center text-sm text-foreground/60 font-geist-sans">
                  Showing {firms.length} of {pagination.totalCount} firms
                </div>
              </>
            )}
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default FirmsPage;
