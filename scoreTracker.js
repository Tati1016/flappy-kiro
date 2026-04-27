/**
 * ScoreTracker Module
 * Tracks and updates the player's score during gameplay
 */

export class ScoreTracker {
  /**
   * Creates a ScoreTracker with initial score of zero
   */
  constructor() {
    this.score = 0;
  }

  /**
   * Reset the score to zero
   */
  reset() {
    this.score = 0;
  }

  /**
   * Increment the score by one
   */
  increment() {
    this.score += 1;
  }

  /**
   * Get the current score
   * @returns {number} Current score value
   */
  getScore() {
    return this.score;
  }
}
