/**
 * Renderer Module
 * Handles all canvas drawing operations for Flappy Kiro
 * Supports fallback rendering when sprites fail to load
 */

export class Renderer {
  /**
   * Creates a Renderer instance
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on
   * @param {CanvasRenderingContext2D} context - The 2D rendering context
   */
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
  }

  /**
   * Clears the entire canvas for the next frame
   */
  clear() {
    this.ctx.fillStyle = '#87CEEB'; // Sky blue background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws Ghosty with sprite rendering or fallback rectangle
   * @param {Ghosty} ghosty - The Ghosty entity to draw
   */
  drawGhosty(ghosty) {
    if (ghosty.sprite && ghosty.sprite.complete && ghosty.sprite.naturalWidth > 0) {
      // Draw sprite if loaded successfully
      this.ctx.drawImage(
        ghosty.sprite,
        ghosty.x,
        ghosty.y,
        ghosty.width,
        ghosty.height
      );
    } else {
      // Fallback: draw colored rectangle
      this.ctx.fillStyle = '#FFD700'; // Gold color
      this.ctx.fillRect(ghosty.x, ghosty.y, ghosty.width, ghosty.height);
      
      // Add simple eyes for character feel
      this.ctx.fillStyle = '#000000';
      const eyeSize = 4;
      const eyeY = ghosty.y + ghosty.height * 0.3;
      this.ctx.fillRect(ghosty.x + 10, eyeY, eyeSize, eyeSize);
      this.ctx.fillRect(ghosty.x + 26, eyeY, eyeSize, eyeSize);
    }
  }

  /**
   * Draws a wall with top and bottom sections and a gap
   * @param {Wall} wall - The Wall entity to draw
   */
  drawWall(wall) {
    const bounds = wall.getBounds();
    
    // Draw top wall section
    this.ctx.fillStyle = '#228B22'; // Forest green
    this.ctx.fillRect(
      bounds.top.x,
      bounds.top.y,
      bounds.top.width,
      bounds.top.height
    );
    
    // Draw bottom wall section
    this.ctx.fillRect(
      bounds.bottom.x,
      bounds.bottom.y,
      bounds.bottom.width,
      Math.min(bounds.bottom.height, this.canvas.height - bounds.bottom.y)
    );
    
    // Add border for visual definition
    this.ctx.strokeStyle = '#1a6b1a'; // Darker green
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      bounds.top.x,
      bounds.top.y,
      bounds.top.width,
      bounds.top.height
    );
    this.ctx.strokeRect(
      bounds.bottom.x,
      bounds.bottom.y,
      bounds.bottom.width,
      Math.min(bounds.bottom.height, this.canvas.height - bounds.bottom.y)
    );
  }

  /**
   * Draws the current score with retro font styling
   * @param {number} score - The score to display
   */
  drawScore(score) {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    
    const text = score.toString();
    const x = this.canvas.width / 2;
    const y = 40;
    
    // Draw text with stroke for better visibility
    this.ctx.strokeText(text, x, y);
    this.ctx.fillText(text, x, y);
  }

  /**
   * Draws the start screen with title and instructions
   */
  drawStartScreen() {
    // Draw title
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 4;
    this.ctx.font = '48px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const titleY = this.canvas.height / 3;
    this.ctx.strokeText('FLAPPY', this.canvas.width / 2, titleY);
    this.ctx.fillText('FLAPPY', this.canvas.width / 2, titleY);
    
    this.ctx.strokeText('KIRO', this.canvas.width / 2, titleY + 60);
    this.ctx.fillText('KIRO', this.canvas.width / 2, titleY + 60);
    
    // Draw instructions
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.lineWidth = 2;
    
    const instructionsY = this.canvas.height / 2 + 80;
    this.ctx.strokeText('CLICK OR PRESS', this.canvas.width / 2, instructionsY);
    this.ctx.fillText('CLICK OR PRESS', this.canvas.width / 2, instructionsY);
    
    this.ctx.strokeText('SPACE TO START', this.canvas.width / 2, instructionsY + 30);
    this.ctx.fillText('SPACE TO START', this.canvas.width / 2, instructionsY + 30);
  }

  /**
   * Draws the game over screen with final score
   * @param {number} score - The final score to display
   */
  drawGameOverScreen(score) {
    // Draw semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw "GAME OVER" text
    this.ctx.fillStyle = '#FF0000';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 4;
    this.ctx.font = '40px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const centerY = this.canvas.height / 2;
    this.ctx.strokeText('GAME OVER', this.canvas.width / 2, centerY - 60);
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, centerY - 60);
    
    // Draw final score
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '24px "Press Start 2P", monospace';
    this.ctx.lineWidth = 3;
    
    this.ctx.strokeText('SCORE', this.canvas.width / 2, centerY);
    this.ctx.fillText('SCORE', this.canvas.width / 2, centerY);
    
    this.ctx.font = '32px "Press Start 2P", monospace';
    this.ctx.strokeText(score.toString(), this.canvas.width / 2, centerY + 40);
    this.ctx.fillText(score.toString(), this.canvas.width / 2, centerY + 40);
    
    // Draw restart instructions
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.lineWidth = 2;
    
    this.ctx.strokeText('CLICK OR PRESS', this.canvas.width / 2, centerY + 100);
    this.ctx.fillText('CLICK OR PRESS', this.canvas.width / 2, centerY + 100);
    
    this.ctx.strokeText('SPACE TO RESTART', this.canvas.width / 2, centerY + 130);
    this.ctx.fillText('SPACE TO RESTART', this.canvas.width / 2, centerY + 130);
  }

  /**
   * Main render entry point that delegates based on game state
   * @param {GameState} gameState - The current game state
   * @param {Ghosty} ghosty - The Ghosty entity
   * @param {Wall[]} walls - Array of Wall entities
   * @param {number} score - The current score
   */
  render(gameState, ghosty, walls, score) {
    // Always clear the canvas first
    this.clear();
    
    if (gameState.isStart()) {
      // Draw start screen
      this.drawStartScreen();
    } else if (gameState.isPlaying()) {
      // Draw gameplay elements
      // Draw walls first (background)
      walls.forEach(wall => this.drawWall(wall));
      
      // Draw Ghosty (foreground)
      this.drawGhosty(ghosty);
      
      // Draw score on top
      this.drawScore(score);
    } else if (gameState.isGameOver()) {
      // Draw final game state with game over overlay
      // Draw walls and Ghosty in background
      walls.forEach(wall => this.drawWall(wall));
      this.drawGhosty(ghosty);
      
      // Draw game over screen on top
      this.drawGameOverScreen(score);
    }
  }
}
