"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, Star, 

} from "lucide-react";

interface Firm {
  _id: string;
  firmName: string;
  ceoFounderName?: string;
  jurisdiction: string;
  yearFounded: number;
  createdAt: string;
  isDraft: boolean;
  isPublished: boolean;
  logo?: {
    url?: string;
    filename?: string;
    originalName?: string;
  };
  logoUrl?: string;
  reviews?: {
    trustPilotRating: number;
    totalLikes: number;
    totalDislikes: number;
  };
}

interface FirmHeaderProps {
  firm: Firm;
  firmId: string;
}

export function FirmHeader({ firm, firmId }: FirmHeaderProps) {
  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getYearsInOperation = (yearFounded: number) => {
    return new Date().getFullYear() - yearFounded;
  };

  return (
    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
      <CardContent className="px-6">
        <div className="flex items-start justify-between">
          {/* Left side - Logo and basic info */}
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center overflow-hidden">
              {firm.logoUrl ? (
                <Image 
                  src={firm.logoUrl} 
                  alt={firm.firmName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            
            {/* Company name and engagement */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white capitalize">{firm.firmName}</h1>
                {/* <div className="flex items-center space-x-1 text-pink-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">28935</span>
                </div> */}
              </div>
              
              {/* Key operational details */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">CEO:</span>
                  <span className="font-semibold capitalize">{firm.ceoFounderName ? firm.ceoFounderName : 'N/A'}</span>
                </div>
                
                <div className="w-px h-4 bg-gray-600"></div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Country:</span>
                  <span className="font-semibold capitalize">{firm.jurisdiction ? firm.jurisdiction : 'N/A'}</span>
                </div>
                
                <div className="w-px h-4 bg-gray-600"></div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Trust Pilot:</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{firm.reviews?.trustPilotRating ? firm.reviews.trustPilotRating : 'N/A'}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                </div>
                
                <div className="w-px h-4 bg-gray-600"></div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Years in Operation:</span>
                  <span className="font-semibold">{getYearsInOperation(firm.yearFounded) ? getYearsInOperation(firm.yearFounded) : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
