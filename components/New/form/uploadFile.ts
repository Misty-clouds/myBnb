import axios from "axios"


export const uploadFile = async (file: File, userId: string): Promise<string> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "bnb_uploads")
    formData.append("folder", `bnb-storage/${userId}`)

    // Add optional parameters for optimization
    formData.append("quality", "auto")
    formData.append("fetch_format", "auto")

    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      
      formData,
    )

    // Return the secure URL from the response
    return response.data.secure_url
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error)
    throw new Error("Failed to upload file to Cloudinary")
  }
}

/**
 * Generates a Cloudinary URL with transformations
 * @param url The original Cloudinary URL
 * @param width Optional width for resizing
 * @param height Optional height for resizing
 * @returns Transformed Cloudinary URL
 */
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url || !url.includes("cloudinary.com")) {
    return url
  }

  // Split the URL to insert transformations
  const baseUrl = url.split("/upload/")[0]
  const imageId = url.split("/upload/")[1]

  // Build transformation string
  let transformations = "c_fill,f_auto,q_auto"
  if (width) transformations += `,w_${width}`
  if (height) transformations += `,h_${height}`

  // Return the transformed URL
  return `${baseUrl}/upload/${transformations}/${imageId}`
}

