import { deleteFileFromBunnyCDN } from './bunnycdn';

/**
 * Clean up files associated with a review
 * @param files - Array of file objects with URL property
 */
export const cleanupReviewFiles = async (files: Array<{ url: string }>): Promise<void> => {
  if (!files || files.length === 0) return;
  
  console.log(`Cleaning up ${files.length} files for review`);
  
  const deletePromises = files.map(async (file) => {
    try {
      await deleteFileFromBunnyCDN(file.url);
      console.log(`Successfully deleted file: ${file.url}`);
    } catch (error) {
      console.warn(`Failed to delete file ${file.url}:`, error);
      // Don't throw error to prevent blocking the main operation
    }
  });
  
  await Promise.allSettled(deletePromises);
};

/**
 * Validate file upload requirements
 * @param file - File object to validate
 * @returns Validation result with success flag and error message
 */
export const validateReviewFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Only JPG, PNG, GIF, and PDF files are accepted.`
    };
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File ${file.name} is too large. Maximum size is 5MB.`
    };
  }
  
  // Check file name length
  if (file.name.length > 255) {
    return {
      isValid: false,
      error: `File name is too long. Maximum length is 255 characters.`
    };
  }
  
  return { isValid: true };
};

/**
 * Get file type category for display purposes
 * @param mimeType - MIME type of the file
 * @returns File category
 */
export const getFileCategory = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType === 'application/pdf') {
    return 'document';
  } else {
    return 'file';
  }
};

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
