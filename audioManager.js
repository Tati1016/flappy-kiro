/**
 * AudioManager Module
 * Manages sound playback with error handling and enable/disable functionality
 */

export class AudioManager {
  /**
   * Create an AudioManager
   * @param {Object} audioAssets - Object mapping sound names to HTMLAudioElement or null
   */
  constructor(audioAssets) {
    this.audioAssets = audioAssets || {};
    this.enabled = true;
  }

  /**
   * Play a sound by name
   * @param {string} soundName - Name of the sound to play
   */
  play(soundName) {
    // No-op if audio is disabled
    if (!this.enabled) {
      return;
    }

    // Defensive check: ensure audioAssets exists
    if (!this.audioAssets) {
      return;
    }

    // Get the audio element
    const audio = this.audioAssets[soundName];

    // Defensive check: ensure audio element exists and is not null
    if (!audio) {
      return;
    }

    // Reset audio to beginning and play
    try {
      audio.currentTime = 0;
      audio.play().catch(error => {
        // Silently handle play errors (e.g., user hasn't interacted with page yet)
        console.warn(`Failed to play sound: ${soundName}`, error);
      });
    } catch (error) {
      // Catch any synchronous errors
      console.warn(`Error playing sound: ${soundName}`, error);
    }
  }

  /**
   * Enable or disable audio playback
   * @param {boolean} enabled - Whether audio should be enabled
   */
  setEnabled(enabled) {
    this.enabled = !!enabled; // Coerce to boolean
  }
}
