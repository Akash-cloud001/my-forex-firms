import cloudinary from "@/lib/cloudinary";
import sharp from "sharp";

function uploadBufferToCloudinary(
  buffer: Buffer,
  options: Record<string, any>
): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        return reject(error || new Error("Cloudinary upload failed"));
      }
      resolve(result);
    });

    stream.end(buffer);
  });
}

export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = "my-forex-firm"
) {
  try {
    let buffer: Buffer;
    let mimeType: string | undefined;
    let fileName: string | undefined;
    let isImage = false;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      mimeType = file.type;
      fileName = file.name;
      isImage = !!mimeType && mimeType.startsWith("image/");
    } else {
      buffer = file;
      mimeType = undefined;
      fileName = undefined;
      isImage = false;
    }

    let originalUpload: any;
    let thumbnailUpload: any | undefined;

    if (isImage) {
      // 1) Upload original image
      originalUpload = await uploadBufferToCloudinary(buffer, {
        folder,
        resource_type: "image",
      });

      // 2) Generate thumbnail with sharp (with error handling)
      try {
        const thumbBuffer = await sharp(buffer)
          // .resize(300, 300, { fit: "cover" }) // square thumbnail
          .jpeg({ quality: 80 })
          .toBuffer();

        // 3) Upload thumbnail as a separate Cloudinary image
        thumbnailUpload = await uploadBufferToCloudinary(thumbBuffer, {
          folder: `${folder}/thumbnails`,
          resource_type: "image",
        });
      } catch (thumbError) {
        console.warn("Failed to generate thumbnail, continuing without it:", thumbError);
      }
    } else {
      const uploadOptions: Record<string, any> = {
        folder,
        resource_type: "raw",
        type: "upload",
      };

      if (fileName) {
        const extension = fileName.split('.').pop();
        if (extension) {
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 15);
          uploadOptions.public_id = `${timestamp}_${randomStr}.${extension}`;
        }
      }

      originalUpload = await uploadBufferToCloudinary(buffer, uploadOptions);
    }

    return {
      success: true,
      url: originalUpload.secure_url,
      public_id: originalUpload.public_id,
      thumbnail_url: thumbnailUpload?.secure_url,
      thumbnail_public_id: thumbnailUpload?.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    const err = error instanceof Error ? error : new Error(String(error));

    return {
      success: false,
      message: err.message || "Failed to upload file",
    };
  }
}
export async function deleteFromCloudinary(
  publicId: string,
  thumbnailPublicId?: string
) {
  try {
    const destroyPromises = [cloudinary.uploader.destroy(publicId)];

    if (thumbnailPublicId) {
      destroyPromises.push(cloudinary.uploader.destroy(thumbnailPublicId));
    }

    const result = await Promise.all(destroyPromises);

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    const err = error instanceof Error ? error : new Error(String(error));

    return {
      success: false,
      message: err.message || "Failed to delete image",
    };
  }
}
