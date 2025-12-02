import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Flame,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

function FirmListSection() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const currentPage = 1;
  const limit = 15;
  const [pagination, setPagination] = useState<ApiResponse["pagination"]>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const router = useRouter();
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
          ...(search && { search }),
        });

        const response = await fetch(`/api/public/firm-list?${params}`);
        const result: ApiResponse = await response.json();

        if (result.success) {
          setFirms(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Error fetching firms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirms();
  }, [currentPage, search]);



  return (
    <div className="min-h-screen text-white px-0 md:px-8 py-8 relative max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-start justify-between w-full px-4 md:px-0">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="font-geist-sans font-semibold text-[24px] leading-[100%] tracking-[-0.05em] bg-linear-to-b from-[#FFFFFF] to-[#999999] bg-clip-text text-transparent drop-shadow-[0_4px_4px_#FFFFFF26]">
                Firms <span className="text-primary font-bold">{pagination.totalCount}</span>
              </h1>
            </div>
          </div>

          {/* Filter Buttons */}
        </div>
        <div className="flex items-center justify-between gap-8 w-full mb-8">
          <div className="flex gap-3 ">
            <Button className=" text-white bg-blend-darken rounded-full px-6 ">
              <Flame className="w-4 h-4 mr-2 " />
              Popular
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-zinc-700 text-gray-400 hover:bg-zinc-900 hover:text-white rounded-full px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>

          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search Firm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 text-gray-400 placeholder:text-gray-600 
             border border-transparent 
             focus-visible:ring-0 focus-visible:ring-offset-0 
             focus-visible:border-primary 
             transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#121313] px-4 xl:px-8 2xl:px-15 rounded-2xl ">

        {/* Firms Grid */}
        <div className="pb-16">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : firms.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">No firms found</div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-wrap gap-3 min-w-0 overflow-x-auto flex-1 pt-6">
              {firms.map((firm) => {
                return (
                  <Card
                    key={firm.id}
                    className="min-w-[140px] w-full sm:w-[220px] bg-zinc-900 duration-100  border-zinc-800 p-4 shrink-0 hover:bg-zinc-800 transition-colors cursor-pointer"
                    onClick={() => router.push(`/firms/${firm.slug}`)}
                  >
                    {/* Content in a row */}
                    <div className=" h-auto flex flex-col items-left gap-3  rounded-2xl">
                      {/* Badge Icons */}
                      <div className="flex gap-10 w-full justify-between">
                        <div className="w-8 h-8 rounded flex flex-col relative">
                          <Image
                            src={firm.image?.thumbnail || firm.image?.url || "/website/firm/imagePlac.png"}
                            alt={firm.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-right max-w-[100px]"> Year Founded {firm.yearFounded}</div>
                      </div>

                      <div className="flex items-end justify-between">
                        {/* Text Content */}
                        <div className="flex flex-col text-left">
                          <div className="text-sm font-medium truncate">{firm.name}</div>
                          {/* <div className="text-xs text-gray-500">
                            {firm.totalPayout}
                          </div> */}
                          <div className="text-xs text-gray-500">
                            0 Reviews
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-primary/50 -rotate-45" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirmListSection;
