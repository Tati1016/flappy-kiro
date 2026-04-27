/**
 * Main Entry Point for Flappy Kiro
 * Initializes canvas, loads assets, and sets up all game components
 */

import { GameState } from './gameState.js';
import { Physics } from './physics.js';
import { Ghosty } from './ghosty.js';
import { WallManager } from './wallManager.js';
import { CollisionDetector } from './collision.js';
import { ScoreTracker } from './scoreTracker.js';
import { AssetLoader } from './assetLoader.js';
import { AudioManager } from './audioManager.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing game...');
  
  // Get canvas and error message elements
  const canvas = document.getElementById('gameCanvas');
  const errorMessage = document.getElementById('errorMessage');

  // Check for canvas element existence
  if (!canvas) {
    console.error('Canvas element not found');
    if (errorMessage) {
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  console.log('Canvas element found:', canvas);

  // Check for 2D context support
  const context = canvas.getContext('2d');
  
  if (!context) {
    console.error('Canvas 2D context not supported');
    canvas.style.display = 'none';
    if (errorMessage) {
      errorMessage.classList.remove('hidden');
    }
    return;
  }

  console.log('Canvas 2D context obtained successfully');

  // Canvas is supported - initialize game
  initializeGame(canvas, context);
});

/**
 * Initialize the game with all components
 * @param {HTMLCanvasElement} canvas - The game canvas
 * @param {CanvasRenderingContext2D} context - The 2D rendering context
 */
async function initializeGame(canvas, context) {
  console.log('Initializing Flappy Kiro...');
  console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
  console.log('Context:', context);
  
  // Create asset manifest with image and audio paths
  const assetManifest = {
    images: {
      ghosty: 'assets/ghosty.png'
    },
    audio: {
      jump: 'assets/jump.wav',
      gameOver: 'assets/game_over.wav'
    }
  };
  
  // Load all assets using AssetLoader
  console.log('Loading assets...');
  const assetLoader = new AssetLoader();
  const assets = await assetLoader.loadAll(assetManifest);
  
  console.log('Assets loaded:', {
    ghostySprite: assets.images.ghosty ? 'loaded' : 'fallback',
    jumpSound: assets.audio.jump ? 'loaded' : 'disabled',
    gameOverSound: assets.audio.gameOver ? 'loaded' : 'disabled'
  });
  
  // Initialize all game components
  console.log('Initializing game components...');
  
  // Game state management
  const gameState = new GameState();
  console.log('GameState initialized:', gameState.getCurrentState());
  
  // Physics engine with default constants from design
  const physics = new Physics(0.6, -10, 12);
  console.log('Physics initialized');
  
  // Player character (Ghosty)
  const ghosty = new Ghosty(100, 320, 40, 40);
  ghosty.sprite = assets.images.ghosty; // Assign loaded sprite (or null for fallback)
  console.log('Ghosty initialized at:', ghosty.x, ghosty.y);
  
  // Wall management
  const wallManager = new WallManager(canvas.width, canvas.height);
  console.log('WallManager initialized');
  
  // Collision detection
  const collisionDetector = new CollisionDetector();
  console.log('CollisionDetector initialized');
  
  // Score tracking
  const scoreTracker = new ScoreTracker();
  console.log('ScoreTracker initialized');
  
  // Audio management
  const audioManager = new AudioManager(assets.audio);
  console.log('AudioManager initialized');
  
  // Rendering system
  const renderer = new Renderer(canvas, context);
  console.log('Renderer initialized');
  
  // Input handling
  const inputHandler = new InputHandler(canvas);
  console.log('InputHandler initialized');
  
  // Set up input handler callback for state transitions and jump
  inputHandler.onInput(() => {
    if (gameState.isStart()) {
      // Transition from START to PLAYING
      gameState.setState(GameState.PLAYING);
    } else if (gameState.isPlaying()) {
      // Apply jump physics during gameplay
      physics.applyJump(ghosty);
      audioManager.play('jump');
    } else if (gameState.isGameOver()) {
      // Reset game and return to START
      gameState.reset();
      ghosty.reset();
      wallManager.reset();
      scoreTracker.reset();
    }
  });
  
  // Enable input handling
  inputHandler.enable();
  
  // Wait for fonts to load before starting the game
  try {
    await document.fonts.ready;
    console.log('Fonts loaded successfully');
  } catch (error) {
    console.warn('Font loading failed, continuing anyway:', error);
  }
  
  // Draw initial start screen
  console.log('Rendering initial start screen...');
  renderer.render(gameState, ghosty, wallManager.walls, scoreTracker.getScore());
  console.log('Initial render complete');
  
  console.log('Flappy Kiro initialized successfully!');
  console.log('Click or press Space to start playing');
  
  // Start the game loop
  let lastTime = performance.now();
  gameLoop(lastTime);
  
  /**
   * Main game loop using requestAnimationFrame
   * Handles physics updates, collision detection, score tracking, and rendering
   * @param {number} currentTime - Current timestamp from requestAnimationFrame
   */
  function gameLoop(currentTime) {
    // Calculate delta time for frame-rate independence
    // Normalize to 60 FPS baseline (16.67ms per frame)
    const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2.0);
    lastTime = currentTime;
    
    // Update game state only during PLAYING
    if (gameState.isPlaying()) {
      // Apply physics: gravity and position updates
      physics.applyGravity(ghosty);
      physics.clampVelocity(ghosty);
      physics.updatePosition(ghosty, deltaTime);
      
      // Update wall manager: spawn, move, and remove walls
      wallManager.update();
      
      // Check for collisions with boundaries
      if (collisionDetector.checkBoundaryCollision(ghosty, canvas.height)) {
        gameState.setState(GameState.GAME_OVER);
        audioManager.play('gameOver');
      }
      
      // Check for collisions with walls
      for (const wall of wallManager.walls) {
        if (collisionDetector.checkWallCollision(ghosty, wall)) {
          gameState.setState(GameState.GAME_OVER);
          audioManager.play('gameOver');
          break; // Exit loop after first collision
        }
      }
      
      // Check for passed walls and increment score
      for (const wall of wallManager.walls) {
        if (!wall.passed && wall.x + wall.width < ghosty.x) {
          wall.passed = true;
          scoreTracker.increment();
        }
      }
    }
    
    // Always render the current frame (regardless of game state)
    renderer.render(gameState, ghosty, wallManager.walls, scoreTracker.getScore());
    
    // Request next animation frame
    requestAnimationFrame(gameLoop);
  }
}
