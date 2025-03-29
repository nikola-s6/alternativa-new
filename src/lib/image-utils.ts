/**
 * Converts a file to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validates if a file is an image and within size limits
 */
export const validateImage = (
  file: File,
  maxSizeMB = 2
): { valid: boolean; message?: string } => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: 'File must be an image' };
  }

  // Check file size (default max 2MB)
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `Image must be smaller than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Compresses an image to reduce file size
 */
export const compressImage = async (
  file: File,
  maxWidthOrHeight = 1200,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down the image if it's larger than maxWidthOrHeight
        if (width > height && width > maxWidthOrHeight) {
          height = Math.round((height * maxWidthOrHeight) / width);
          width = maxWidthOrHeight;
        } else if (height > maxWidthOrHeight) {
          width = Math.round((width * maxWidthOrHeight) / height);
          height = maxWidthOrHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }

            // Create a new file from the blob
            const newFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(newFile);
          },
          file.type,
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};
