/**
 * Collision Detection Module
 * Detects collisions between Ghosty and walls or screen boundaries using AABB algorithm
 */

export class CollisionDetector {
  /**
   * Checks if two rectangles intersect using Axis-Aligned Bounding Box (AABB) algorithm
   * @param {Object} rect1 - First rectangle with x, y, width, height properties
   * @param {Object} rect2 - Second rectangle with x, y, width, height properties
   * @returns {boolean} True if rectangles intersect, false otherwise
   */
  rectanglesIntersect(rect1, rect2) {
    // Defensive validation for malformed entities
    if (!rect1 || !rect2) {
      return false;
    }
    
    if (typeof rect1.x !== 'number' || typeof rect1.y !== 'number' ||
        typeof rect1.width !== 'number' || typeof rect1.height !== 'number') {
      return false;
    }
    
    if (typeof rect2.x !== 'number' || typeof rect2.y !== 'number' ||
        typeof rect2.width !== 'number' || typeof rect2.height !== 'number') {
      return false;
    }

    // AABB collision detection
    // Rectangles intersect if they overlap on both X and Y axes
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  /**
   * Checks if Ghosty collides with a wall
   * Walls have two rectangles: top section and bottom section with a gap in between
   * @param {Object} ghosty - Ghosty entity with getBounds() method
   * @param {Object} wall - Wall entity with getBounds() method returning {top, bottom}
   * @returns {boolean} True if collision detected, false otherwise
   */
  checkWallCollision(ghosty, wall) {
    // Defensive validation for malformed entities
    if (!ghosty || !wall) {
      return false;
    }
    
    if (typeof ghosty.getBounds !== 'function') {
      return false;
    }
    
    if (typeof wall.getBounds !== 'function') {
      return false;
    }

    const ghostyBounds = ghosty.getBounds();
    const wallBounds = wall.getBounds();
    
    // Validate that getBounds returned valid objects
    if (!ghostyBounds || !wallBounds) {
      return false;
    }
    
    if (!wallBounds.top || !wallBounds.bottom) {
      return false;
    }

    // Check collision with top wall section
    const topCollision = this.rectanglesIntersect(ghostyBounds, wallBounds.top);
    
    // Check collision with bottom wall section
    const bottomCollision = this.rectanglesIntersect(ghostyBounds, wallBounds.bottom);

    return topCollision || bottomCollision;
  }

  /**
   * Checks if Ghosty has collided with screen boundaries (top or bottom)
   * @param {Object} ghosty - Ghosty entity with y and height properties
   * @param {number} canvasHeight - Height of the canvas (pixels)
   * @returns {boolean} True if Ghosty is above or below screen bounds, false otherwise
   */
  checkBoundaryCollision(ghosty, canvasHeight) {
    // Defensive validation for malformed entities
    if (!ghosty) {
      return false;
    }
    
    if (typeof ghosty.y !== 'number' || typeof ghosty.height !== 'number') {
      return false;
    }
    
    if (typeof canvasHeight !== 'number' || canvasHeight <= 0) {
      return false;
    }

    // Check if Ghosty is above the screen (y < 0)
    const aboveScreen = ghosty.y < 0;
    
    // Check if Ghosty is below the screen (y + height > canvasHeight)
    const belowScreen = ghosty.y + ghosty.height > canvasHeight;

    return aboveScreen || belowScreen;
  }
}
