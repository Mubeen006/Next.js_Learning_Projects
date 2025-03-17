/**
 * Checks if a URL is a Cloudinary URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

/**
 * Optimizes a Cloudinary URL with specified parameters
 * @param {string} url - The Cloudinary URL to optimize
 * @param {Object} options - Options for optimization
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.quality - Image quality (auto, good, best, eco)
 * @param {boolean} options.fetchFormat - Whether to convert to optimal format
 * @returns {string} - The optimized URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!isCloudinaryUrl(url)) return url;
  
  const {
    width = 500,
    height = 500,
    quality = 'auto',
    fetchFormat = true
  } = options;
  
  try {
    // Parse the URL to identify the upload path
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;
    
    // Build transformation string
    let transformations = [];
    
    // Add quality
    transformations.push(`q_${quality}`);
    
    // Add dimensions
    if (width && height) {
      transformations.push(`c_fill,w_${width},h_${height},g_face`);
    } else if (width) {
      transformations.push(`w_${width}`);
    } else if (height) {
      transformations.push(`h_${height}`);
    }
    
    // Add format optimization if requested
    if (fetchFormat) {
      transformations.push('f_auto');
    }
    
    // Combine transformations
    const transformationString = transformations.join(',');
    
    // Return the optimized URL
    return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error);
    return url;
  }
}; 