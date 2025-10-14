import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// BunnyCDN Configuration
const BUNNYCDN_STORAGE_HOSTNAME = process.env.BUNNYCDN_STORAGE_HOSTNAME || 'storage.bunnycdn.com';
const BUNNYCDN_STORAGE_ZONE_NAME = process.env.BUNNYCDN_STORAGE_ZONE_NAME;
const BUNNYCDN_API_KEY = process.env.BUNNYCDN_API_KEY;
const BUNNYCDN_CDN_BASE_URL = process.env.BUNNYCDN_CDN_BASE_URL;

if (!BUNNYCDN_STORAGE_ZONE_NAME || !BUNNYCDN_API_KEY || !BUNNYCDN_CDN_BASE_URL) {
  throw new Error('BunnyCDN credentials are not properly configured in environment variables.');
}

// Create BunnyCDN API client
const bunnyCDNClient = axios.create({
  baseURL: `https://${BUNNYCDN_STORAGE_HOSTNAME}/${BUNNYCDN_STORAGE_ZONE_NAME}/`,
  headers: {
    AccessKey: BUNNYCDN_API_KEY,
  },
  timeout: 30000, // 30 seconds timeout
});

export interface BunnyCDNFile {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

/**
 * Upload a file to BunnyCDN Storage
 * @param fileBuffer - The file buffer to upload
 * @param originalFileName - The original filename
 * @param mimeType - The MIME type of the file
 * @param folder - Optional folder path (e.g., 'logos', 'images')
 * @returns Promise<BunnyCDNFile> - The uploaded file information
 */
export const uploadFileToBunnyCDN = async (
  fileBuffer: Buffer,
  originalFileName: string,
  mimeType: string,
  folder: string = 'logos'
): Promise<BunnyCDNFile> => {
  try {
    // Generate unique filename to prevent conflicts
    const fileExtension = originalFileName.split('.').pop() || '';
    const uniqueFileName = `${uuidv4()}-${Date.now()}.${fileExtension}`;
    const filePath = `${folder}/${uniqueFileName}`;

    console.log(`Uploading file to BunnyCDN: ${filePath}`);

    const response = await bunnyCDNClient.put(filePath, fileBuffer, {
      headers: {
        'Content-Type': mimeType,
      },
    });

    if (response.status === 201) {
      // Ensure CDN base URL has proper protocol
      const baseUrl = BUNNYCDN_CDN_BASE_URL.startsWith('http') 
        ? BUNNYCDN_CDN_BASE_URL 
        : `https://${BUNNYCDN_CDN_BASE_URL}`;
      
      const cdnUrl = `${baseUrl}/${filePath}`;
      
      // Validate the URL format
      if (!/^https?:\/\/.+/.test(cdnUrl)) {
        throw new Error(`Invalid CDN URL generated: ${cdnUrl}`);
      }
      
      return {
        filename: originalFileName,
        url: cdnUrl,
        size: fileBuffer.length,
        mimeType: mimeType,
      };
    }

    throw new Error(`BunnyCDN upload failed: ${response.status} - ${response.data}`);
  } catch (error: any) {
    console.error('Error uploading to BunnyCDN:', error);
    throw new Error(`Failed to upload file to BunnyCDN: ${error.message}`);
  }
};

/**
 * Delete a file from BunnyCDN Storage
 * @param fileUrl - The full CDN URL of the file to delete
 * @returns Promise<void>
 */
export const deleteFileFromBunnyCDN = async (fileUrl: string): Promise<void> => {
  try {
    // Extract the file path from the CDN URL
    const url = new URL(fileUrl);
    const filePath = url.pathname.substring(1); // Remove leading slash

    console.log(`Deleting file from BunnyCDN: ${filePath}`);

    const response = await bunnyCDNClient.delete(filePath);
    
    if (response.status === 200 || response.status === 204) {
      console.log(`Successfully deleted file: ${filePath}`);
    } else {
      console.warn(`Unexpected response when deleting file: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error deleting from BunnyCDN:', error);
    // Don't throw error for delete operations to prevent blocking updates
    console.warn(`Failed to delete file from BunnyCDN: ${error.message}`);
  }
};

/**
 * Check if a file exists in BunnyCDN Storage
 * @param fileUrl - The full CDN URL of the file
 * @returns Promise<boolean>
 */
export const checkFileExistsInBunnyCDN = async (fileUrl: string): Promise<boolean> => {
  try {
    const url = new URL(fileUrl);
    const filePath = url.pathname.substring(1);
    
    const response = await bunnyCDNClient.head(filePath);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Get file information from BunnyCDN Storage
 * @param fileUrl - The full CDN URL of the file
 * @returns Promise<any> - File metadata
 */
export const getFileInfoFromBunnyCDN = async (fileUrl: string): Promise<any> => {
  try {
    const url = new URL(fileUrl);
    const filePath = url.pathname.substring(1);
    
    const response = await bunnyCDNClient.head(filePath);
    return {
      exists: response.status === 200,
      size: response.headers['content-length'],
      lastModified: response.headers['last-modified'],
      contentType: response.headers['content-type'],
    };
  } catch (error) {
    return { exists: false };
  }
};

/**
 * Handle BunnyCDN errors with user-friendly messages
 * @param error - The error object from BunnyCDN API
 * @returns string - User-friendly error message
 */
export const handleBunnyCDNError = (error: any): string => {
  if (error.response) {
    // BunnyCDN API returned an error
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    switch (status) {
      case 401:
        return 'BunnyCDN authentication failed. Check your API key.';
      case 403:
        return 'BunnyCDN access forbidden. Check your storage zone permissions.';
      case 404:
        return 'BunnyCDN storage zone not found.';
      case 413:
        return 'File too large for BunnyCDN upload.';
      case 429:
        return 'BunnyCDN rate limit exceeded. Please try again later.';
      default:
        return `BunnyCDN error: ${status} - ${message}`;
    }
  } else if (error.request) {
    return 'Network error connecting to BunnyCDN. Please check your internet connection.';
  } else {
    return `BunnyCDN configuration error: ${error.message}`;
  }
};

/**
 * Upload file to BunnyCDN with retry logic
 * @param fileBuffer - The file buffer to upload
 * @param originalFileName - The original filename
 * @param mimeType - The MIME type of the file
 * @param folder - Optional folder path
 * @param maxRetries - Maximum number of retry attempts
 * @returns Promise<BunnyCDNFile> - The uploaded file information
 */
export const uploadFileToBunnyCDNWithRetry = async (
  fileBuffer: Buffer,
  originalFileName: string,
  mimeType: string,
  folder: string = 'logos',
  maxRetries: number = 3
): Promise<BunnyCDNFile> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries}`);
      return await uploadFileToBunnyCDN(fileBuffer, originalFileName, mimeType, folder);
    } catch (error) {
      lastError = error;
      console.warn(`Upload attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Upload failed after ${maxRetries} attempts: ${handleBunnyCDNError(lastError)}`);
};

