"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    MessageSquare,
    FileText,
    CheckCircle,
    XCircle,
    Mail,
    Clock,
    Send,
    User,
    Building2,
    AlertCircle,
    Paperclip
} from 'lucide-react';
import { IAdminMessage, ReviewDetailModalProps, statusColors, statusLabels } from './types';

const ISSUE_CATEGORIES = [
    { id: 'service-quality', label: 'Service Quality' },
    { id: 'billing', label: 'Billing Issues' },
    { id: 'communication', label: 'Communication' },
];



const getIssueCategoryLabel = (categoryId: string) => {
    const category = ISSUE_CATEGORIES.find(c => c.id === categoryId);
    return category ? category.label : categoryId;
};

export default function ReviewDetailModal({
    review,
    isOpen,
    onOpenChange,
    onApprove,
    onReject,
    onRequestInfo,
    isUpdating,
    formatDate
}: ReviewDetailModalProps) {
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [infoSubject, setInfoSubject] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [sendEmail, setSendEmail] = useState(true);

    // Confirmation dialog states
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    const handleRequestInfo = () => {
        if (!review || !infoMessage.trim()) return;

        if (sendEmail) {
            console.log('Sending email:', {
                reviewId: review._id,
                subject: infoSubject,
                message: infoMessage,
                userEmail: review.userDetails?.email
            });
        }

        onRequestInfo(review._id, infoSubject, infoMessage);
        setInfoSubject('');
        setInfoMessage('');
        setSendEmail(true);
        setShowInfoForm(false);
    };

    const handleApprove = () => {
        if (!review) return;
        onApprove(review._id);
        setShowApproveConfirm(false);
    };

    const handleReject = () => {
        if (!review) return;
        onReject(review._id);
        setShowRejectConfirm(false);
    };

    const resetForm = () => {
        setShowInfoForm(false);
        setInfoSubject('');
        setInfoMessage('');
        setSendEmail(true);
    };

    if (!review) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                onOpenChange(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 bg-card text-white border-border">
                    <DialogHeader className="px-6 py-4 border-b border-border/50">
                        <div className="flex items-center">
                            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-white mr-10">
                                <MessageSquare className="h-5 w-5" />
                                Review Details
                            </DialogTitle>
                            <Badge className={statusColors[review.status]}>
                                {statusLabels[review.status]}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <Tabs defaultValue="details" className="w-full">
                        <div className="px-6 pt-4">
                            <TabsList className="grid w-full grid-cols-2 bg-muted/20">
                                <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="communication" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                                    Communication
                                    {review.adminMessages && review.adminMessages.length > 0 && (
                                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                            {review.adminMessages.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ height: 'calc(85vh - 180px)' }}>
                            <TabsContent value="details" className="px-6 pb-6 mt-0 pt-4 space-y-4">
                                {/* User & Firm Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" />
                                            Submitted By
                                        </Label>
                                        {review.userDetails && (
                                            <div className="text-sm">
                                                <p className="font-medium text-white">
                                                    {review.userDetails.firstName} {review.userDetails.lastName}
                                                </p>
                                                <p className="text-muted-foreground text-xs">{review.userDetails.email}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Building2 className="h-3.5 w-3.5" />
                                            Firm Name
                                        </Label>
                                        <p className="text-sm font-medium capitalize text-white">{review.firmName}</p>
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                {/* Issue Info */}
                                <div className="space-y-3">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Issue Information
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Category</p>
                                            <Badge variant="outline" className="text-white border-border/50">
                                                {getIssueCategoryLabel(review.issueCategory)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Sub-Category</p>
                                            <p className="capitalize text-white">
                                                {review.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                        </div>
                                        {review.customIssueType && (
                                            <div className="col-span-2">
                                                <p className="text-xs text-muted-foreground mb-1">Custom Issue Type</p>
                                                <p className="text-sm text-white">{review.customIssueType}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5" />
                                        Description
                                    </Label>
                                    <div className="bg-muted/20 rounded-md p-3 border border-border/30">
                                        <p className="text-sm whitespace-pre-wrap text-white">{review.description}</p>
                                    </div>
                                </div>

                                {/* Attachments */}
                                {review.files && review.files.length > 0 && (
                                    <>
                                        <Separator className="bg-border/50" />
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <Paperclip className="h-3.5 w-3.5" />
                                                Attachments ({review.files.length})
                                            </Label>
                                            <div className="space-y-2">
                                                {review.files.map((file, index) => (
                                                    <a
                                                        key={index}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-2 rounded-md border border-border/50 hover:bg-muted/30 transition-colors"
                                                    >
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm flex-1 truncate text-white">{file.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {(file.size / 1024).toFixed(1)} KB
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Separator className="bg-border/50" />

                                {/* Timeline */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        Timeline
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Created</p>
                                            <p className="text-sm text-white">{formatDate(review.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Last Updated</p>
                                            <p className="text-sm text-white">{formatDate(review.updatedAt)}</p>
                                        </div>
                                        {review.infoRequestCount !== undefined && review.infoRequestCount > 0 && (
                                            <div className="col-span-2">
                                                <p className="text-xs text-muted-foreground">Info Requests Sent</p>
                                                <Badge variant="secondary">{review.infoRequestCount}</Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                {/* Actions Section */}
                                <div className="space-y-3 pt-2">
                                    <Label className="text-xs text-muted-foreground">Actions</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Button
                                            onClick={() => setShowApproveConfirm(true)}
                                            disabled={review.status === 'approved' || review.status === 'rejected'}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            size="sm"
                                        // disabled={review.status === 'approved'}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => setShowRejectConfirm(true)}
                                            disabled={review.status === 'approved' || review.status === 'rejected'}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => setShowInfoForm(true)}
                                            disabled={review.status === 'approved' || review.status === 'rejected'}
                                            variant="outline"
                                            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                                            size="sm"
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            Request Info
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="communication" className="px-6 pb-6 mt-0 pt-4 space-y-3">
                                {review.adminMessages && review.adminMessages.length > 0 ? (
                                    review.adminMessages.map((msg: IAdminMessage, index: number) => (
                                        <div key={msg._id || index} className="border border-border/50 rounded-lg p-4 space-y-3 bg-muted/10">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge variant="outline" className="text-xs capitalize border-border/50">
                                                            {msg.senderRole}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs capitalize border-border/50">
                                                            {msg.messageType.replace('-', ' ')}
                                                        </Badge>
                                                        {msg.emailSent ? (
                                                            <Badge className="text-xs bg-green-600/20 text-green-400 border-green-600/30">
                                                                <Mail className="h-3 w-3 mr-1" />
                                                                Email Sent
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-xs border-orange-600/30 text-orange-400">
                                                                <Mail className="h-3 w-3 mr-1" />
                                                                Not Sent
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="font-medium text-white">{msg.senderName}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatDate(msg.sentAt)}
                                                </div>
                                            </div>

                                            {msg.subject && (
                                                <div className="pt-1">
                                                    <p className="text-sm font-semibold text-white">{msg.subject}</p>
                                                </div>
                                            )}

                                            <div className="bg-muted/20 rounded-md p-3 border border-border/30">
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No communication history yet</p>
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Request Info Form Dialog */}
            <Dialog open={showInfoForm} onOpenChange={setShowInfoForm}>
                <DialogContent className="max-w-2xl bg-card text-white border-border">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Request More Information
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Subject (Optional)</Label>
                            <Input
                                value={infoSubject}
                                onChange={(e) => setInfoSubject(e.target.value)}
                                placeholder="e.g., Additional Documentation Required"
                                className="bg-muted/20 border-border/50 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Message *</Label>
                            <Textarea
                                value={infoMessage}
                                onChange={(e) => setInfoMessage(e.target.value)}
                                placeholder="Describe what additional information you need from the user..."
                                rows={6}
                                className="bg-muted/20 border-border/50 text-white resize-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="sendEmail"
                                checked={sendEmail}
                                onChange={(e) => setSendEmail(e.target.checked)}
                                className="w-4 h-4 rounded border-border/50"
                            />
                            <Label htmlFor="sendEmail" className="text-sm text-white cursor-pointer">
                                Send email notification to user
                            </Label>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={handleRequestInfo}
                                disabled={isUpdating || !infoMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Request
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowInfoForm(false)}
                                className="border-border/50"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
                <AlertDialogContent className="bg-card text-white border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Approve Review?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This will approve the review and it will be visible to all users. This action can be reversed later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border/50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Approve Review
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
                <AlertDialogContent className="bg-card text-white border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Reject Review?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This will reject the review and it will not be visible to users. This action can be reversed later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border/50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReject}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Reject Review
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}