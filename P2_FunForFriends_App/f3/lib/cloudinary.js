import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary Configuration
 * 
 * This file sets up the Cloudinary SDK with your account credentials.
 * These credentials should be stored in your .env.local file.
 * 
 * Required environment variables:
 * - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - CLOUDINARY_API_KEY: Your Cloudinary API key
 * - CLOUDINARY_API_SECRET: Your Cloudinary API secret
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Use HTTPS
});

/**
 * Uploads an image to Cloudinary
 * 
 * @param {string} base64Image - Base64 encoded image string
 * @param {string} folder - Optional folder name to organize images
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export async function uploadImage(base64Image, folder = 'Fun-For-Friends') {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image',
      // Add optional transformations if needed
      transformation: [
        { width: 800, crop: 'limit' }, // Resize to max width of 800px
        { quality: 'auto' } // Automatic quality optimization
      ]
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default cloudinary; 