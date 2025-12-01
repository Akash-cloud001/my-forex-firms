import cloudinary from "@/lib/cloudinary";

export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = "my-forex-firm"
) {
  try {
    let base64Data: string;
    let mimeType: string;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      mimeType = file.type;
      base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else {
      mimeType = "image/jpeg";
      base64Data = `data:image/jpeg;base64,${file.toString("base64")}`;
    }

    // Determine resource type: 'image' for images, 'raw' for PDFs and other files
    const resourceType = mimeType.startsWith('image/') ? 'image' : 'raw';

    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: resourceType,
    });

    // Only generate thumbnail for images
    let thumbUrl: string | undefined;
    if (resourceType === 'image') {
      thumbUrl = cloudinary.url(`${result.public_id}.jpg`, {
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "auto" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });
    }

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      thumbnail_url: thumbUrl,
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

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
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
