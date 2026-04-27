/**
 * WallManager Module
 * Manages the lifecycle of walls: generation, movement, and removal
 */

import { Wall } from './wall.js';

export class WallManager {
  /**
   * Creates a WallManager to handle wall spawning and updates
   * @param {number} canvasWidth - Width of the game canvas (pixels)
   * @param {number} canvasHeight - Height of the game canvas (pixels)
   */
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.walls = [];
    this.framesSinceLastWall = 0;
    
    // Constants from design document
    this.WALL_SPAWN_INTERVAL = 90; // frames (~1.5 seconds at 60 FPS)
    this.GAP_HEIGHT = 150; // pixels
    this.WALL_WIDTH = 60; // pixels
    
    // Calculate valid bounds for gap positioning
    // Gap center must be positioned so the gap is fully visible
    this.MIN_GAP_Y = this.GAP_HEIGHT / 2;
    this.MAX_GAP_Y = this.canvasHeight - this.GAP_HEIGHT / 2;
  }

  /**
   * Generates a new wall with random gap position within valid bounds
   * Walls spawn at the right edge of the canvas
   */
  generateWall() {
    // Random gap position within valid bounds
    const gapY = this.MIN_GAP_Y + Math.random() * (this.MAX_GAP_Y - this.MIN_GAP_Y);
    
    // Spawn wall at right edge of canvas
    const wall = new Wall(this.canvasWidth, gapY, this.GAP_HEIGHT, this.WALL_WIDTH);
    
    this.walls.push(wall);
  }

  /**
   * Updates all walls and spawns new ones at intervals
   * Called each frame during gameplay
   */
  update() {
    // Update all existing walls
    this.walls.forEach(wall => wall.update());
    
    // Remove walls that have moved off-screen
    this.removeOffScreenWalls();
    
    // Increment frame counter
    this.framesSinceLastWall++;
    
    // Spawn new wall at interval
    if (this.framesSinceLastWall >= this.WALL_SPAWN_INTERVAL) {
      this.generateWall();
      this.framesSinceLastWall = 0;
    }
  }

  /**
   * Removes walls that have moved completely off the left side of the screen
   * Prevents memory leaks by cleaning up unused wall objects
   */
  removeOffScreenWalls() {
    this.walls = this.walls.filter(wall => !wall.isOffScreen());
  }

  /**
   * Clears all walls and resets the spawn timer
   * Used when restarting the game
   */
  reset() {
    this.walls = [];
    this.framesSinceLastWall = 0;
  }
}
