// Helpers for product photos uploaded from the admin's local device.

/** True for images we can display: uploaded data URLs or remote http(s) URLs. */
export const isImageSource = (src: string): boolean =>
  typeof src === 'string' && (src.startsWith('data:image/') || src.startsWith('http'));

/**
 * Reads a local image file, resizes it so its longest side is at most `maxSize`px,
 * and returns it as a compressed JPEG data URL. Keeps local storage small.
 */
export const compressImage = (file: File, maxSize = 800, quality = 0.8): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas is not supported in this browser'));
        return;
      }
      // White background so transparent PNGs don't turn black when saved as JPEG.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read this image file'));
    };

    img.src = objectUrl;
  });
