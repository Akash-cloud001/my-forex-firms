import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

function FirmListSection() {
  const firmRows = [
    {
      ptIndex: 9,
      firms: [
        { name: "FundingPips", reviews: 10, rank: 1 },
        { name: "FundingPips", reviews: 10, rank: 2 },
        { name: "FundingPips", reviews: 10, rank: 3 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
      ],
      stamp: "approved",
    },
    {
      ptIndex: 7,
      firms: [
        { name: "FundingPips", reviews: 10, rank: 1 },
        { name: "FundingPips", reviews: 10, rank: 2 },
        { name: "FundingPips", reviews: 10, rank: 3 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
      ],
      stamp: "verified",
    },
    {
      ptIndex: 5,
      firms: [
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
        { name: "FundingPips", reviews: 10 },
      ],
      stamp: "classic",
    },
  ];

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-9xl mx-auto ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h1 className="font-[Geist] font-semibold text-[24px] leading-[100%] tracking-[-0.05em] bg-linear-to-b from-[#FFFFFF] to-[#999999] bg-clip-text text-transparent drop-shadow-[0_4px_4px_#FFFFFF26]">
                  Firms <span className="text-primary font-bold">100</span>
                </h1>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3 mb-8">
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
          </div>

          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search Firm"
              className="pl-10 bg-white/5 text-gray-400 placeholder:text-gray-600 
             border border-transparent 
             focus-visible:ring-0 focus-visible:ring-offset-0 
             focus-visible:border-primary 
             transition-colors duration-200"
            />
          </div>
        </div>

        <div className="bg-[#121313] px-15 rounded-2xl ">
          {/* Firms Table Header */}
          <div className="flex items-center mb-6 pt-6 ">
            <div className="w-24 text-sm  text-gray-500 uppercase">
              PT Index
            </div>
            <span className="border h-6 text-white/20"></span>

            <div className="pl-5 flex-1 text-sm text-gray-500 uppercase">
              Firms
            </div>
          </div>

          {/* Firm Rows */}
          <div className="space-y-6 pb-16">
            {firmRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-4">
                {/* PT Index */}
                <div className="justify-between flex items-center">
                  <div className="w-24 flex items-center gap-2 ">
                    <span className="text-5xl font-light">{row.ptIndex}</span>
                    {rowIndex < 2 && (
                      <ChevronLeft className="w-5 h-5 text-primary" />
                    )}
                    {rowIndex === 2 && (
                      <ChevronRight className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <span className="border h-6 text-white/20"></span>
                </div>

                {/* Firms Grid */}
                <div className="flex-1 flex items-center gap-3">
                  {row.firms.map((firm, firmIndex) => (
                    <Card
                      key={firmIndex}
                      className="bg-zinc-900 duration-100  border-zinc-800 p-4 flex-1 hover:bg-zinc-800 transition-colors cursor-pointer "
                    >
                      {/* Content in a row */}
                      <div className=" w-[115px] h-auto flex flex-col items-left gap-3  rounded-2xl">
                        {/* Badge Icons */}
                        <div className="flex gap-10 ">
                          <div className="w-12 h-12 rounded flex flex-col">
                            <Image
                              src={"/website/firm/imagePlac.png"}
                              alt="placeholder"
                              height={48}
                              width={48}
                            />
                          </div>
                          {firm.rank === 1 && (
                            <div className="w-7 h-7  rounded-full flex  items-center justify-center">
                             <Image src={"/website/badge/badge1.png"} alt="badge1" height={20} width={20}/>
                            </div>
                          )}
                          {firm.rank === 2 && (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center">
                               <Image src={"/website/badge/badge2.png"} alt="badge1" height={20} width={20}/>
                            </div>
                          )}
                            {firm.rank === 3 && (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center">
                               <Image src={"/website/badge/badge3.png"} alt="badge1" height={20} width={20}/>
                            </div>
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col text-left">
                          <div className="text-sm font-medium">{firm.name}</div>
                          <div className="text-xs text-gray-500">
                            {firm.reviews} Reviews
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* View More Button */}
                  <div className="flex flex-col items-center justify-center gap-2 px-4">
                    <div className="relative">
                      {row.stamp === "approved" && (
                        <Image
                          src={"/website/firm/highly-trusted.png"}
                          alt="img"
                          height={64}
                          width={64}
                        />
                      )}
                      {row.stamp === "verified" && (
                        <Image
                          src={"/website/firm/trusted.png"}
                          alt="img"
                          height={64}
                          width={64}
                        />
                      )}
                      {row.stamp === "classic" && (
                        <Image
                          src={"/website/firm/danger.png"}
                          alt="img"
                          height={64}
                          width={64}
                        />
                      )}
                    </div>
                    <Button
                      variant="link"
                      className="text-red-500 hover:text-red-400 text-xs"
                    >
                      View more
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirmListSection;
