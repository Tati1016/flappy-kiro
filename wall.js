/**
 * Wall Module
 * Represents an obstacle with a gap that scrolls across the screen
 */

export class Wall {
  /**
   * Creates a Wall entity
   * @param {number} x - Initial X position (pixels)
   * @param {number} gapY - Y position of gap center (pixels)
   * @param {number} gapHeight - Height of gap (pixels)
   * @param {number} width - Width of wall (pixels)
   */
  constructor(x, gapY, gapHeight = 150, width = 60) {
    this.x = x;
    this.gapY = gapY;
    this.gapHeight = gapHeight;
    this.width = width;
    this.speed = 3; // pixels/frame as per design document
    this.passed = false; // Flag to track if Ghosty has passed this wall
  }

  /**
   * Updates the wall position by moving it horizontally
   * Called each frame to create scrolling effect
   */
  update() {
    this.x -= this.speed;
  }

  /**
   * Checks if the wall has moved completely off the left side of the screen
   * @returns {boolean} True if wall should be removed, false otherwise
   */
  isOffScreen() {
    // Wall is off-screen when its right edge is past the left edge of canvas
    return this.x + this.width < 0;
  }

  /**
   * Get bounding rectangles for collision detection
   * Returns two rectangles: top wall section and bottom wall section
   * @returns {Object} Object with 'top' and 'bottom' rectangle properties
   */
  getBounds() {
    // Calculate gap boundaries
    const gapTop = this.gapY - this.gapHeight / 2;
    const gapBottom = this.gapY + this.gapHeight / 2;

    return {
      // Top wall section (from top of screen to top of gap)
      top: {
        x: this.x,
        y: 0,
        width: this.width,
        height: gapTop
      },
      // Bottom wall section (from bottom of gap to bottom of screen)
      bottom: {
        x: this.x,
        y: gapBottom,
        width: this.width,
        height: 10000 // Large value to extend to bottom of any canvas size
      }
    };
  }
}
