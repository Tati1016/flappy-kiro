/**
 * InputHandler Module
 * Handles mouse and keyboard input for the game.
 * 
 * Listens for:
 * - Mouse clicks on the canvas
 * - Spacebar key presses
 * 
 * Provides lifecycle management through enable() and disable() methods.
 */

export class InputHandler {
  /**
   * Create an InputHandler
   * @param {HTMLCanvasElement} canvas - The canvas element to attach click listeners to
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.callback = null;
    this.enabled = false;

    // Bind event handlers to maintain 'this' context
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Register a callback function to be called when input is detected
   * @param {Function} callback - Function to call on input events
   */
  onInput(callback) {
    this.callback = callback;
  }

  /**
   * Handle mouse click events
   * @private
   */
  handleClick() {
    if (this.enabled && this.callback) {
      this.callback();
    }
  }

  /**
   * Handle keyboard events
   * @private
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyDown(event) {
    // Check if spacebar was pressed
    if (event.code === 'Space' || event.key === ' ') {
      // Prevent default behavior to avoid page scrolling
      event.preventDefault();

      if (this.enabled && this.callback) {
        this.callback();
      }
    }
  }

  /**
   * Enable input handling by attaching event listeners
   */
  enable() {
    if (this.enabled) {
      return; // Already enabled
    }

    this.enabled = true;
    this.canvas.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Disable input handling by removing event listeners
   */
  disable() {
    if (!this.enabled) {
      return; // Already disabled
    }

    this.enabled = false;
    this.canvas.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
