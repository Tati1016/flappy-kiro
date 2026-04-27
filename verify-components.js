// Component Verification Script for Flappy Kiro
// This script checks that all required components are implemented

import { GameState } from './gameState.js';
import { Physics } from './physics.js';
import { Ghosty } from './ghosty.js';
import { CollisionDetector } from './collision.js';
import { Wall } from './wall.js';
import { WallManager } from './wallManager.js';
import { ScoreTracker } from './scoreTracker.js';
import { AssetLoader } from './assetLoader.js';
import { AudioManager } from './audioManager.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

console.log('='.repeat(60));
console.log('FLAPPY KIRO - COMPONENT VERIFICATION');
console.log('='.repeat(60));

let allPassed = true;

function verify(componentName, component, requiredMethods = []) {
  console.log(`\nVerifying ${componentName}...`);
  
  if (!component) {
    console.error(`✗ ${componentName} is not defined`);
    allPassed = false;
    return false;
  }
  
  console.log(`✓ ${componentName} is defined`);
  
  // Check required methods
  for (const method of requiredMethods) {
    if (typeof component.prototype[method] === 'function' || typeof component[method] === 'function') {
      console.log(`  ✓ ${method}() exists`);
    } else {
      console.error(`  ✗ ${method}() is missing`);
      allPassed = false;
    }
  }
  
  return true;
}

// Verify all components
verify('GameState', GameState, ['getCurrentState', 'setState', 'reset', 'isPlaying', 'isGameOver', 'isStart']);
verify('Physics', Physics, ['applyGravity', 'applyJump', 'updatePosition', 'clampVelocity']);
verify('Ghosty', Ghosty, ['reset', 'getBounds']);
verify('CollisionDetector', CollisionDetector, ['checkWallCollision', 'checkBoundaryCollision', 'rectanglesIntersect']);
verify('Wall', Wall, ['update', 'isOffScreen', 'getBounds']);
verify('WallManager', WallManager, ['update', 'generateWall', 'removeOffScreenWalls', 'reset']);
verify('ScoreTracker', ScoreTracker, ['reset', 'increment', 'getScore']);
verify('AssetLoader', AssetLoader, ['loadImage', 'loadAudio', 'loadAll']);
verify('AudioManager', AudioManager, ['play', 'setEnabled']);
verify('Renderer', Renderer, ['clear', 'drawGhosty', 'drawWall', 'drawScore', 'drawStartScreen', 'drawGameOverScreen', 'render']);
verify('InputHandler', InputHandler, ['onInput', 'enable', 'disable']);

console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('✓ ALL COMPONENTS VERIFIED SUCCESSFULLY');
  console.log('All required modules and methods are implemented.');
} else {
  console.error('✗ VERIFICATION FAILED');
  console.error('Some components or methods are missing.');
}
console.log('='.repeat(60));

process.exit(allPassed ? 0 : 1);
