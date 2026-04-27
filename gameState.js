/**
 * GameState Module
 * Manages the current state of the game and transitions between states.
 * 
 * Valid state transitions:
 * - START → PLAYING
 * - PLAYING → GAME_OVER
 * - GAME_OVER → START
 */

export class GameState {
  // Game state constants
  static START = 'START';
  static PLAYING = 'PLAYING';
  static GAME_OVER = 'GAME_OVER';

  constructor() {
    this.currentState = GameState.START;
  }

  /**
   * Get the current game state
   * @returns {string} Current state (START, PLAYING, or GAME_OVER)
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Set a new game state with validation
   * Only allows valid state transitions:
   * - START → PLAYING
   * - PLAYING → GAME_OVER
   * - GAME_OVER → START
   * 
   * @param {string} newState - The state to transition to
   */
  setState(newState) {
    // Define valid transitions
    const validTransitions = {
      [GameState.START]: [GameState.PLAYING],
      [GameState.PLAYING]: [GameState.GAME_OVER],
      [GameState.GAME_OVER]: [GameState.START]
    };

    // Check if the transition is valid
    if (!validTransitions[this.currentState].includes(newState)) {
      console.warn(`Invalid state transition: ${this.currentState} -> ${newState}`);
      return;
    }

    this.currentState = newState;
  }

  /**
   * Reset the game state to START
   */
  reset() {
    this.currentState = GameState.START;
  }

  /**
   * Check if the game is currently in PLAYING state
   * @returns {boolean} True if game is playing
   */
  isPlaying() {
    return this.currentState === GameState.PLAYING;
  }

  /**
   * Check if the game is currently in GAME_OVER state
   * @returns {boolean} True if game is over
   */
  isGameOver() {
    return this.currentState === GameState.GAME_OVER;
  }

  /**
   * Check if the game is currently in START state
   * @returns {boolean} True if game is at start screen
   */
  isStart() {
    return this.currentState === GameState.START;
  }
}
