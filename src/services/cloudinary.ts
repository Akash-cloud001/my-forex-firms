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

    const thumbUrl = cloudinary.url(`${result.public_id}.jpg`, {
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      thumbnail_url:thumbUrl,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    const err = error instanceof Error ? error : new Error(String(error));

    return {
      success: false,
      message: err.message || "Failed to upload image",
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
