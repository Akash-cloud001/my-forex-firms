import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";


import { useFirmList } from "@/hooks/queries/useFirmList";

function FirmListSection() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "yearFounded">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const currentPage = 1;
  const limit = 11;

  const { data, isLoading } = useFirmList({
    page: currentPage,
    limit,
    search,
    sortBy,
    order: sortOrder,
  });

  const firms = data?.data || [];
  const loading = isLoading;

  const router = useRouter();

  const handleSortChange = (value: string) => {
    // Parse the value: "name-asc", "name-desc", "yearFounded-asc", "yearFounded-desc"
    const [field, order] = value.split('-') as [("name" | "yearFounded"), ("asc" | "desc")];
    setSortBy(field);
    setSortOrder(order);
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
    <div className="min-h-screen text-white px-0 md:px-8 py-8 relative max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start justify-between w-full px-4 md:px-0">
        <div className="flex items-center justify-center mb-10 w-full  ">
          <h1 className="font-geist-sans font-semibold text-4xl leading-[100%] tracking gradient-text text-center relative">
            Firms
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent rounded-3xl shadow-md"></div>
          </h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full mb-8">
          {/* Search Bar - Left */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <Input
                placeholder="Search firms by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Filters - Right */}
          <div className="flex gap-3">
            {/* <Button className=" text-white bg-blend-darken rounded-full px-6 ">
              <Flame className="w-4 h-4 mr-2 " />
              Popular
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-zinc-700 text-gray-400 hover:bg-zinc-900 hover:text-white rounded-full px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New
            </Button> */}


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 border-zinc-700 text-gray-400 hover:bg-zinc-900 hover:text-white rounded-full px-6"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Sort By {sortBy !== "name" || sortOrder !== "asc" ? `(${getSortDisplayText()})` : ""}
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
      </div>

      <div className="">

        {/* Firms Grid */}
        <div className="">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
              {Array.from({ length: 12 }).map((_, index) => (
                <Card
                  key={index}
                  className="group min-w-[140px] w-full card-custom-grad duration-100 p-4 shrink-0"
                >
                  <div className="h-auto flex flex-col items-left gap-3 rounded-2xl">
                    <div className="flex gap-10 w-full justify-between">
                      <Skeleton className="w-12 h-12 rounded-[4px]" />
                      <div className="flex flex-col items-end gap-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <div className="flex flex-col text-left gap-2 w-full">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="w-4 h-4 rounded-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : firms.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">No firms found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
              {firms.map((firm) => {
                return (
                  <Card
                    key={firm.id}
                    className="group min-w-[140px] w-full card-custom-grad duration-100  p-4 shrink-0 transition-colors cursor-pointer"
                    onClick={() => router.push(`/firms/${firm.slug}`)}
                  >
                    {/* Content in a row */}
                    <div className=" h-auto flex flex-col items-left gap-3  rounded-2xl">
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
                        <div className="text-xs text-foreground/70 text-right max-w-[60px]">Founded <span className="font-semibold text-sm">{firm.yearFounded}</span></div>
                      </div>

                      <div className="flex items-end justify-between">
                        {/* Text Content */}
                        <div className="flex flex-col text-left">
                          <div className="text-base font-semibold truncate">{firm.name}</div>
                          {/* <div className="text-xs text-gray-500">
                            {firm.totalPayout}
                          </div> */}
                          <div className="text-xs text-foreground/70">
                            {firm.totalReview} Reviews
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-primary/70 -rotate-45 group-hover:rotate-0 group-hover:text-primary transition-all duration-300" />
                      </div>
                    </div>
                  </Card>
                );
              })}
              <Button className="mt-8 sm:mt-0 w-full h-full bg-primary group rounded-full sm:rounded-md py-0 " onClick={() => router.push("/firms")}>
                <span className="text-foreground text-base font-semibold">View More</span>
                <ArrowRight className="w-8 h-8 text-foreground -rotate-45 group-hover:rotate-0 transition-all duration-300" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirmListSection;
