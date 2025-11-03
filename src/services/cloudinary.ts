import cloudinary from "@/lib/cloudinary";

export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = "my-forex-firm"
) {
  try {
    let base64Data: string;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else {
      base64Data = `data:image/jpeg;base64,${file.toString("base64")}`;
    }

    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
    });
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      message: error.message || "Failed to upload image",
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
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete image",
    };
  }
}


