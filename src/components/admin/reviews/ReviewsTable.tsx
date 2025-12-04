"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';
import { Review, statusColors, statusLabels } from './types';
import { ISSUE_CATEGORIES } from '@/components/website/constant/constants';

interface ReviewsTableProps {
    reviews: Review[];
    onReviewClick: (review: Review) => void;
    formatDate: (dateString: string) => string;
}

const getIssueCategoryLabel = (categoryId: string) => {
    const category = ISSUE_CATEGORIES.find(c => c.id === categoryId);
    return category ? category.label : categoryId;
};

export function ReviewsTable({ reviews, onReviewClick, formatDate }: ReviewsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Firm</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr
                            key={review._id}
                            className="border-b border-border/30 hover:bg-card/30 transition-colors cursor-pointer"
                            onClick={() => onReviewClick(review)}
                        >
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h3 className="font-medium text-white text-sm">
                                            {review.userDetails ? `${review.userDetails.firstName} ${review.userDetails.lastName}` : 'Loading...'}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {review.userDetails?.email || 'Unknown email'}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <Building className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <h3 className="font-medium text-white text-sm">
                                            {review.firmName}
                                        </h3>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <Badge variant="outline" className="text-xs">
                                    {getIssueCategoryLabel(review.issueCategory)}
                                </Badge>
                            </td>
                            <td className="py-4 px-4">
                                <span className="text-sm text-white capitalize">
                                    {review.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <Badge className={statusColors[review.status]}>
                                    {statusLabels[review.status]}
                                </Badge>
                            </td>
                            <td className="py-4 px-4">
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(review.createdAt)}
                                </p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
