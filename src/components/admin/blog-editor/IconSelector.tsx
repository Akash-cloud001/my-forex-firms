"use client";

import React from 'react';
import { Star, Search, Scale, BarChart3, TrendingUp, List, DollarSign, Users, MessageCircle, CheckCircle, AlertTriangle, Target, LucideIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const iconMap: Record<string, LucideIcon> = {
  Star,
  Search,
  Scale,
  BarChart3,
  TrendingUp,
  List,
  DollarSign,
  Users,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Target,
};

export const iconOptions = Object.keys(iconMap);

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function IconSelector({
  value,
  onChange,
  className,
  disabled = false,
}: IconSelectorProps) {
  const SelectedIcon = iconMap[value] || Star;

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <div className="flex items-center gap-2">
          <SelectedIcon className="h-4 w-4" />
          <SelectValue placeholder="Select icon" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {iconOptions.map((iconName) => {
          const Icon = iconMap[iconName];
          return (
            <SelectItem key={iconName} value={iconName}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{iconName}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

