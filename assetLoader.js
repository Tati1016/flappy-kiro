/**
 * AssetLoader Module
 * Loads images and audio files asynchronously with graceful error handling
 */

export class AssetLoader {
  constructor() {
    // No state needed for this utility class
  }

  /**
   * Load an image from a path
   * @param {string} path - Path to the image file
   * @returns {Promise<HTMLImageElement|null>} Promise that resolves to Image or null on error
   */
  loadImage(path) {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.warn(`Failed to load image: ${path}`, error);
        resolve(null); // Graceful degradation - return null instead of rejecting
      };
      
      img.src = path;
    });
  }

  /**
   * Load an audio file from a path
   * @param {string} path - Path to the audio file
   * @returns {Promise<HTMLAudioElement|null>} Promise that resolves to Audio or null on error
   */
  loadAudio(path) {
    return new Promise((resolve) => {
      const audio = new Audio();
      
      audio.oncanplaythrough = () => {
        resolve(audio);
      };
      
      audio.onerror = (error) => {
        console.warn(`Failed to load audio: ${path}`, error);
        resolve(null); // Graceful degradation - return null instead of rejecting
      };
      
      audio.src = path;
    });
  }

  /**
   * Load all assets from a manifest with graceful degradation
   * @param {Object} manifest - Asset manifest with 'images' and 'audio' properties
   * @param {Object} manifest.images - Object mapping asset names to image paths
   * @param {Object} manifest.audio - Object mapping asset names to audio paths
   * @returns {Promise<Object>} Promise that resolves to object with loaded assets
   */
  async loadAll(manifest) {
    const assets = {
      images: {},
      audio: {}
    };

    // Load all images
    if (manifest.images) {
      const imagePromises = Object.entries(manifest.images).map(async ([name, path]) => {
        const img = await this.loadImage(path);
        assets.images[name] = img;
      });
      await Promise.all(imagePromises);
    }

    // Load all audio
    if (manifest.audio) {
      const audioPromises = Object.entries(manifest.audio).map(async ([name, path]) => {
        const audio = await this.loadAudio(path);
        assets.audio[name] = audio;
      });
      await Promise.all(audioPromises);
    }

    return assets;
  }
}
