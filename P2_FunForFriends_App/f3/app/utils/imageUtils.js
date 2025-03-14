/**
 * Utility functions for handling images in the frontend
 */

/**
 * Converts a file to base64 format for preview and upload
 * 
 * @param {File} file - The file object from input[type="file"]
 * @returns {Promise<string>} - A promise that resolves to the base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Optimizes an image URL from Cloudinary by adding transformation parameters
 * 
 * @param {string} cloudinaryUrl - The original Cloudinary URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.crop - Crop mode (fill, limit, etc.)
 * @returns {string} - The optimized Cloudinary URL
 */
export const optimizeCloudinaryUrl = (cloudinaryUrl, options = {}) => {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl;
  }
  
  // Default options
  const { 
    width = 400, 
    height = 400, 
    crop = 'fill',
    quality = 'auto'
  } = options;
  
  // Find the upload part of the URL
  const uploadIndex = cloudinaryUrl.indexOf('/upload/');
  
  if (uploadIndex === -1) {
    return cloudinaryUrl;
  }
  
  // Insert transformation parameters after /upload/
  const transformationString = `c_${crop},w_${width},h_${height},q_${quality}`;
  
  return cloudinaryUrl.slice(0, uploadIndex + 8) + 
         transformationString + '/' + 
         cloudinaryUrl.slice(uploadIndex + 8);
};

/**
 * Checks if a URL is a Cloudinary URL
 * 
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is from Cloudinary
 */
export const isCloudinaryUrl = (url) => {
  return url && typeof url === 'string' && url.includes('cloudinary.com');
}; 