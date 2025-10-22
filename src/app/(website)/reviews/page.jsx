"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Calendar, MessageSquare, FileText, Image as ImageIcon, ExternalLink, Trash2, Edit } from 'lucide-react'
import { getReviews } from '@/lib/reviewApi'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await getReviews({
        status: filter === 'all' ? undefined : filter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })
      setReviews(response.reviews)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-500'
    if (rating >= 3) return 'text-yellow-500'
    return 'text-red-500'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Your Reviews</h1>
            <p className="text-lg text-muted-foreground">Loading your submitted reviews...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Your Reviews</h1>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-800 dark:text-red-200">Error loading reviews: {error}</p>
              <Button onClick={fetchReviews} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Reviews</h1>
          <p className="text-base text-muted-foreground">
            Manage and track your submitted reviews
          </p>
        </div>

        {/* Filter Tabs */}
        {/* <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: 'all', label: 'All Reviews', count: reviews.length },
            { key: 'pending', label: 'Pending', count: reviews.filter(r => r.status === 'pending').length },
            { key: 'approved', label: 'Approved', count: reviews.filter(r => r.status === 'approved').length },
            { key: 'rejected', label: 'Rejected', count: reviews.filter(r => r.status === 'rejected').length }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'default' : 'ghost'}
              onClick={() => setFilter(tab.key)}
              className={"flex items-center gap-2 text-white/80 hover:text-white"}
            >
              {tab.label}
              <Badge variant="secondary" className="ml-1">
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div> */}

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No reviews found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? "You haven't submitted any reviews yet." 
                : `No ${filter} reviews found.`
              }
            </p>
            <Button asChild>
              <a href="/post-review">Submit Your First Review</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
                <Card key={review._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                 
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {review.firmName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(review.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge className={cn("text-xs capitalize", getStatusColor(review.status))}>
                      {review.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 -mt-4">
                  {/* Rating */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < review.rating ? "fill-current" : "text-muted-foreground",
                            getRatingColor(review.rating)
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md">
                            {review.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {review.isVerified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Verified
                        </Badge>
                        )}
                    </div>
                  </div>

                  {/* Issue Type */}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {review.description}
                  </p>

                  {/* File count indicator */}
                  {review.files && review.files.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>{review.files.length} attachment{review.files.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Analytics */}
                  {/* {review.analytics && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {review.analytics.views || 0} views
                      </div>
                      {review.analytics.helpfulVotes > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {review.analytics.helpfulVotes} helpful
                        </div>
                      )}
                    </div>
                  )} */}

                  {/* Actions */}
                  {/* <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination would go here if needed */}
      </div>
    </div>
  )
}

export default ReviewsPage