export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'info-requested';

export type AdminMessageType = 'info-request' | 'follow-up' | 'internal-note' | 'final-decision';

export interface IAdminMessage {
    _id?: string;
    senderId: string;
    senderRole: 'admin' | 'moderator';
    senderName?: string;
    messageType: AdminMessageType;
    subject?: string;
    message: string;
    sentAt: string;
    emailSent: boolean;
    emailSentAt?: string;
}

export interface Review {
    _id: string;
    userId: string;
    firmId?: string;
    firmName: string;
    issueCategory: string;
    issueType: string;
    customIssueType?: string;
    description: string;
    files?: Array<{
        name: string;
        type: string;
        size: number;
        url: string;
    }>;
    status: ReviewStatus;
    isVerified: boolean;
    adminMessages?: IAdminMessage[];
    infoRequestCount?: number;
    createdAt: string;
    updatedAt: string;
    userDetails?: {
        firstName: string;
        lastName: string;
        email: string;
        imageUrl: string;
    };
}

export const statusColors: Record<ReviewStatus, string> = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    'info-requested': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
};

export const statusLabels: Record<ReviewStatus, string> = {
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    'info-requested': 'Info Requested'
};
export interface ReviewDetailModalProps {
    review: Review | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onApprove: (reviewId: string) => void;
    onReject: (reviewId: string) => void;
    onRequestInfo: (reviewId: string, subject: string, message: string) => void;
    isUpdating: boolean;
    formatDate: (dateString: string) => string;
}