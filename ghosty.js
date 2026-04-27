/**
 * Ghosty Module
 * Represents the player character with position, velocity, dimensions, and sprite
 */

export class Ghosty {
  /**
   * Creates a Ghosty entity
   * @param {number} x - Initial X position (pixels)
   * @param {number} y - Initial Y position (pixels)
   * @param {number} width - Width of Ghosty (pixels)
   * @param {number} height - Height of Ghosty (pixels)
   */
  constructor(x = 100, y = 320, width = 40, height = 40) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = 0;
    this.sprite = null; // Will be set by asset loader
  }

  /**
   * Reset Ghosty to starting position and velocity
   */
  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.velocity = 0;
  }

  /**
   * Get bounding rectangle for collision detection
   * @returns {Object} Rectangle with x, y, width, and height properties
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
