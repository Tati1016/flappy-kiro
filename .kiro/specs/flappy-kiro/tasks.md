# Implementation Plan: Flappy Kiro

## Overview

This implementation plan breaks down the Flappy Kiro game into discrete coding tasks. The game is a browser-based endless scrolling game built with vanilla JavaScript, HTML5 Canvas, and CSS. The implementation follows a modular architecture with clear separation between game state, physics, rendering, collision detection, and input handling.

The approach is incremental: we'll build core infrastructure first, then add game mechanics, followed by visual polish and audio. Each task builds on previous work, with checkpoints to validate progress.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create `index.html` with canvas element and basic page structure
  - Create `styles.css` with canvas styling and retro font imports
  - Set up proper viewport and responsive canvas sizing
  - Add error message container for unsupported browsers
  - _Requirements: Core game infrastructure_

- [ ] 2. Implement core game state management
  - [x] 2.1 Create `gameState.js` module
    - Implement `GameState` class with state transitions (START, PLAYING, GAME_OVER)
    - Add state validation to prevent invalid transitions
    - Implement state query methods (`isPlaying()`, `isGameOver()`, `isStart()`)
    - Add `reset()` method to return to START state
    - _Requirements: Game state management, state transitions_
  
  - [ ]* 2.2 Write unit tests for game state
    - Test valid state transitions (START → PLAYING → GAME_OVER → START)
    - Test invalid state transitions are rejected
    - Test state query methods return correct values
    - Test reset functionality
    - _Requirements: Game state management_

- [ ] 3. Implement physics engine
  - [x] 3.1 Create `physics.js` module
    - Implement `Physics` class with gravity, jump velocity, and max fall velocity constants
    - Implement `applyGravity()` to increase velocity each frame
    - Implement `applyJump()` to set upward velocity
    - Implement `clampVelocity()` to limit maximum fall speed
    - Implement `updatePosition()` with delta-time support for frame-rate independence
    - _Requirements: Physics simulation, gravity mechanics, jump mechanics_
  
  - [ ]* 3.2 Write unit tests for physics
    - Test gravity increases velocity correctly
    - Test jump sets velocity to jump velocity constant
    - Test velocity clamping limits to max fall speed
    - Test position updates based on velocity and delta time
    - Test extreme velocity values are handled correctly
    - _Requirements: Physics simulation_

- [ ] 4. Implement Ghosty entity and collision detection
  - [x] 4.1 Create `ghosty.js` module
    - Implement `Ghosty` class with position, velocity, dimensions, and sprite properties
    - Implement `reset()` method to return to starting position
    - Implement `getBounds()` method returning rectangle for collision detection
    - _Requirements: Player character, entity management_
  
  - [x] 4.2 Create `collision.js` module
    - Implement `CollisionDetector` class
    - Implement `rectanglesIntersect()` for AABB collision detection
    - Implement `checkWallCollision()` to detect Ghosty-wall collisions
    - Implement `checkBoundaryCollision()` to detect screen boundary collisions
    - Add defensive validation for malformed entities
    - _Requirements: Collision detection, boundary detection_
  
  - [ ]* 4.3 Write unit tests for collision detection
    - Test `rectanglesIntersect()` with overlapping rectangles
    - Test `rectanglesIntersect()` with non-overlapping rectangles
    - Test `rectanglesIntersect()` with edge-touching rectangles
    - Test boundary collision detection (above/below screen)
    - Test boundary collision with Ghosty within bounds
    - Test defensive validation handles invalid entities
    - _Requirements: Collision detection_

- [x] 5. Checkpoint - Verify core mechanics
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement wall system
  - [x] 6.1 Create `wall.js` module
    - Implement `Wall` class with position, gap, dimensions, speed, and passed flag
    - Implement `update()` method to move wall horizontally
    - Implement `isOffScreen()` method to check if wall should be removed
    - Implement `getBounds()` method returning top and bottom rectangles for collision
    - _Requirements: Obstacle generation, scrolling mechanics_
  
  - [x] 6.2 Create `wallManager.js` module
    - Implement `WallManager` class to manage wall lifecycle
    - Implement `generateWall()` with random gap position within valid bounds
    - Implement `update()` to move all walls and spawn new ones at intervals
    - Implement `removeOffScreenWalls()` to clean up memory
    - Implement `reset()` to clear all walls
    - Add frame counter for spawn interval timing
    - _Requirements: Obstacle generation, wall spawning, memory management_
  
  - [ ]* 6.3 Write unit tests for wall system
    - Test `isOffScreen()` returns true when wall is past left edge
    - Test `isOffScreen()` returns false when wall is visible
    - Test wall generation creates walls with random gap positions
    - Test gap positions are within valid bounds (not too high or low)
    - Test wall removal filters out off-screen walls
    - _Requirements: Obstacle generation_

- [ ] 7. Implement score tracking
  - [x] 7.1 Create `scoreTracker.js` module
    - Implement `ScoreTracker` class with score property
    - Implement `reset()` to set score to zero
    - Implement `increment()` to increase score by one
    - Implement `getScore()` to retrieve current score
    - _Requirements: Score tracking_
  
  - [ ]* 7.2 Write unit tests for score tracking
    - Test reset sets score to zero
    - Test increment increases score by one
    - Test multiple increments accumulate correctly
    - Test getScore returns current score
    - _Requirements: Score tracking_

- [ ] 8. Implement asset loading system
  - [x] 8.1 Create `assetLoader.js` module
    - Implement `AssetLoader` class
    - Implement `loadImage()` returning Promise with error handling
    - Implement `loadAudio()` returning Promise with error handling
    - Implement `loadAll()` to load asset manifest with graceful degradation
    - Add console warnings for failed asset loads
    - _Requirements: Asset loading, error handling for missing assets_
  
  - [x] 8.2 Create `audioManager.js` module
    - Implement `AudioManager` class to manage sound playback
    - Implement `play()` method with error handling (no-op if audio unavailable)
    - Implement `setEnabled()` to toggle audio on/off
    - Add defensive checks for null audio elements
    - _Requirements: Audio playback, error handling_

- [ ] 9. Implement rendering system
  - [-] 9.1 Create `renderer.js` module
    - Implement `Renderer` class with canvas and context references
    - Implement `clear()` to clear canvas each frame
    - Implement `drawGhosty()` with sprite rendering and fallback rectangle
    - Implement `drawWall()` to render top and bottom wall sections with gap
    - Implement `drawScore()` with retro font styling
    - Implement `drawStartScreen()` with title and instructions
    - Implement `drawGameOverScreen()` with final score display
    - Implement `render()` as main entry point that delegates based on game state
    - _Requirements: Visual rendering, UI screens, fallback rendering_

- [ ] 10. Implement input handling
  - [~] 10.1 Create `input.js` module
    - Implement `InputHandler` class
    - Add event listeners for mouse click and spacebar
    - Implement `onInput()` callback registration
    - Implement `enable()` and `disable()` for lifecycle management
    - Prevent default behavior for spacebar to avoid page scrolling
    - _Requirements: Input handling, keyboard controls, mouse controls_

- [~] 11. Checkpoint - Verify all components are implemented
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement main game loop and integration
  - [~] 12.1 Create `main.js` entry point
    - Initialize canvas and check for 2D context support
    - Display error message if canvas not supported
    - Create asset manifest with image and audio paths
    - Load all assets using `AssetLoader`
    - Initialize all game components (GameState, Physics, Ghosty, WallManager, etc.)
    - Set up input handler with callback for state transitions and jump
    - _Requirements: Game initialization, browser compatibility_
  
  - [~] 12.2 Implement game loop with requestAnimationFrame
    - Calculate delta time for frame-rate independence
    - Clamp delta time to prevent physics breaking on tab focus loss
    - Update physics (apply gravity, update position) during PLAYING state
    - Update wall manager (spawn, move, remove walls) during PLAYING state
    - Check collisions and trigger GAME_OVER state
    - Check for passed walls and increment score
    - Call renderer to draw current frame
    - Request next animation frame
    - _Requirements: Game loop, frame-rate independence, collision detection integration_
  
  - [~] 12.3 Wire input handling to game actions
    - During START state: transition to PLAYING on input
    - During PLAYING state: apply jump physics and play jump sound on input
    - During GAME_OVER state: reset game and transition to START on input
    - _Requirements: Input handling, state transitions, audio feedback_
  
  - [ ]* 12.4 Write integration tests for game loop
    - Test game initializes with START state
    - Test input during START transitions to PLAYING
    - Test walls spawn during PLAYING state
    - Test collision triggers GAME_OVER state
    - Test score increments when Ghosty passes wall
    - Test game reset from GAME_OVER returns to START
    - _Requirements: Game loop, state transitions, collision detection_

- [ ] 13. Add visual polish and styling
  - [~] 13.1 Enhance CSS styling
    - Add retro font imports (e.g., Press Start 2P from Google Fonts)
    - Style canvas with border and centered layout
    - Add background color and page styling
    - Style error message container
    - Add responsive design for different screen sizes
    - _Requirements: Visual presentation, retro aesthetic_
  
  - [~] 13.2 Enhance rendering visuals
    - Add background color to canvas
    - Add visual feedback for game states (different colors/text)
    - Ensure score is clearly visible with high contrast
    - Add instructions text on start screen
    - Polish game over screen with restart instructions
    - _Requirements: Visual presentation, UI clarity_

- [ ] 14. Final integration and testing
  - [~] 14.1 Test complete game flow
    - Verify game loads without errors
    - Verify start screen displays correctly
    - Verify click and spacebar both start game
    - Verify Ghosty responds to input during gameplay
    - Verify walls scroll smoothly at correct speed
    - Verify collision detection triggers game over
    - Verify score increments correctly
    - Verify game over screen displays with final score
    - Verify restart works correctly
    - _Requirements: Complete game functionality_
  
  - [~] 14.2 Test error handling and edge cases
    - Test game with missing sprite asset (verify fallback rendering)
    - Test game with missing audio assets (verify silent gameplay)
    - Test game on browser without canvas support (verify error message)
    - Test rapid input during different game states
    - Test tab focus loss and return (verify physics doesn't break)
    - _Requirements: Error handling, graceful degradation_
  
  - [ ]* 14.3 Cross-browser testing
    - Test on Chrome, Firefox, Safari, Edge
    - Test on different screen resolutions
    - Verify audio works across browsers
    - Verify canvas rendering is consistent
    - _Requirements: Browser compatibility_

- [~] 15. Final checkpoint - Complete game validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements are met
  - Confirm game is ready for deployment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- The game uses vanilla JavaScript with no framework dependencies
- All code should follow ES6+ syntax with modules
- Canvas rendering should be optimized for 60 FPS performance
- Error handling should provide graceful degradation when assets fail
- The implementation is entirely client-side with no backend requirements
- Testing focuses on unit tests for pure logic and integration tests for game loop behavior
- Manual testing is required for visual rendering, audio feedback, and gameplay feel
