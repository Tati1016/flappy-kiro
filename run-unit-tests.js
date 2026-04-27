// Unit Tests for Flappy Kiro Components
// These tests verify core logic without requiring a browser

import { GameState } from './gameState.js';
import { Physics } from './physics.js';
import { Ghosty } from './ghosty.js';
import { CollisionDetector } from './collision.js';
import { Wall } from './wall.js';
import { WallManager } from './wallManager.js';
import { ScoreTracker } from './scoreTracker.js';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    testsPassed++;
    return true;
  } else {
    console.error(`✗ ${message}`);
    testsFailed++;
    return false;
  }
}

function testSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(title);
  console.log('='.repeat(60));
}

// Test GameState
function testGameState() {
  testSection('GameState Tests');
  
  const state = new GameState();
  
  // Test initial state
  assert(state.getCurrentState() === 'START', 'Initial state is START');
  assert(state.isStart(), 'isStart() returns true initially');
  assert(!state.isPlaying(), 'isPlaying() returns false initially');
  assert(!state.isGameOver(), 'isGameOver() returns false initially');
  
  // Test valid transitions
  state.setState('PLAYING');
  assert(state.getCurrentState() === 'PLAYING', 'Transition START -> PLAYING works');
  assert(state.isPlaying(), 'isPlaying() returns true after transition');
  
  state.setState('GAME_OVER');
  assert(state.getCurrentState() === 'GAME_OVER', 'Transition PLAYING -> GAME_OVER works');
  assert(state.isGameOver(), 'isGameOver() returns true after transition');
  
  state.setState('START');
  assert(state.getCurrentState() === 'START', 'Transition GAME_OVER -> START works');
  
  // Test invalid transition
  const beforeState = state.getCurrentState();
  state.setState('GAME_OVER'); // Invalid: START -> GAME_OVER
  assert(state.getCurrentState() === beforeState, 'Invalid transition is rejected');
  
  // Test reset
  state.setState('PLAYING');
  state.setState('GAME_OVER');
  state.reset();
  assert(state.getCurrentState() === 'START', 'reset() returns to START state');
}

// Test Physics
function testPhysics() {
  testSection('Physics Tests');
  
  const physics = new Physics(0.6, -10, 12);
  const ghosty = new Ghosty(100, 200, 40, 40);
  
  // Test applyGravity
  ghosty.velocity = 0;
  physics.applyGravity(ghosty);
  assert(ghosty.velocity === 0.6, 'applyGravity increases velocity by GRAVITY');
  
  physics.applyGravity(ghosty);
  assert(ghosty.velocity === 1.2, 'applyGravity accumulates velocity');
  
  // Test applyJump
  physics.applyJump(ghosty);
  assert(ghosty.velocity === -10, 'applyJump sets velocity to JUMP_VELOCITY');
  
  // Test clampVelocity
  ghosty.velocity = 15;
  physics.clampVelocity(ghosty);
  assert(ghosty.velocity === 12, 'clampVelocity limits to MAX_FALL_VELOCITY');
  
  ghosty.velocity = 5;
  physics.clampVelocity(ghosty);
  assert(ghosty.velocity === 5, 'clampVelocity preserves normal velocity');
  
  // Test updatePosition
  ghosty.y = 100;
  ghosty.velocity = 10;
  physics.updatePosition(ghosty, 1.0);
  assert(ghosty.y === 110, 'updatePosition updates y by velocity');
  
  ghosty.y = 100;
  ghosty.velocity = 10;
  physics.updatePosition(ghosty, 2.0);
  assert(ghosty.y === 120, 'updatePosition respects deltaTime');
}

// Test Ghosty
function testGhosty() {
  testSection('Ghosty Tests');
  
  const ghosty = new Ghosty(100, 200, 40, 40);
  
  // Test initial properties
  assert(ghosty.x === 100, 'Initial x position is correct');
  assert(ghosty.y === 200, 'Initial y position is correct');
  assert(ghosty.width === 40, 'Width is correct');
  assert(ghosty.height === 40, 'Height is correct');
  assert(ghosty.velocity === 0, 'Initial velocity is 0');
  
  // Test getBounds
  const bounds = ghosty.getBounds();
  assert(bounds.x === 100, 'getBounds returns correct x');
  assert(bounds.y === 200, 'getBounds returns correct y');
  assert(bounds.width === 40, 'getBounds returns correct width');
  assert(bounds.height === 40, 'getBounds returns correct height');
  
  // Test reset
  ghosty.x = 300;
  ghosty.y = 400;
  ghosty.velocity = 10;
  ghosty.reset();
  assert(ghosty.x === 100, 'reset() restores x position');
  assert(ghosty.y === 200, 'reset() restores y position');
  assert(ghosty.velocity === 0, 'reset() clears velocity');
}

// Test CollisionDetector
function testCollisionDetector() {
  testSection('CollisionDetector Tests');
  
  const detector = new CollisionDetector();
  
  // Test rectanglesIntersect - overlapping
  const rect1 = { x: 0, y: 0, width: 10, height: 10 };
  const rect2 = { x: 5, y: 5, width: 10, height: 10 };
  assert(detector.rectanglesIntersect(rect1, rect2), 'Detects overlapping rectangles');
  
  // Test rectanglesIntersect - non-overlapping
  const rect3 = { x: 0, y: 0, width: 10, height: 10 };
  const rect4 = { x: 20, y: 20, width: 10, height: 10 };
  assert(!detector.rectanglesIntersect(rect3, rect4), 'Detects non-overlapping rectangles');
  
  // Test rectanglesIntersect - edge touching
  const rect5 = { x: 0, y: 0, width: 10, height: 10 };
  const rect6 = { x: 10, y: 0, width: 10, height: 10 };
  assert(!detector.rectanglesIntersect(rect5, rect6), 'Edge-touching rectangles do not collide');
  
  // Test checkBoundaryCollision
  const ghosty1 = { y: -10, height: 40 };
  assert(detector.checkBoundaryCollision(ghosty1, 640), 'Detects Ghosty above screen');
  
  const ghosty2 = { y: 620, height: 40 };
  assert(detector.checkBoundaryCollision(ghosty2, 640), 'Detects Ghosty below screen');
  
  const ghosty3 = { y: 300, height: 40 };
  assert(!detector.checkBoundaryCollision(ghosty3, 640), 'Ghosty within bounds is valid');
  
  // Test defensive validation
  assert(!detector.rectanglesIntersect(null, rect1), 'Handles null entities gracefully');
  assert(!detector.checkBoundaryCollision(null, 640), 'Handles null Ghosty gracefully');
}

// Test Wall
function testWall() {
  testSection('Wall Tests');
  
  const wall = new Wall(480, 320, 150, 60);
  
  // Test initial properties
  assert(wall.x === 480, 'Initial x position is correct');
  assert(wall.gapY === 320, 'Gap Y position is correct');
  assert(wall.gapHeight === 150, 'Gap height is correct');
  assert(wall.width === 60, 'Wall width is correct');
  assert(wall.speed === 3, 'Wall speed is correct');
  assert(wall.passed === false, 'Initial passed flag is false');
  
  // Test update
  wall.update();
  assert(wall.x === 477, 'update() moves wall left by speed');
  
  // Test isOffScreen
  const wall2 = new Wall(10, 200, 150, 60);
  assert(!wall2.isOffScreen(), 'Wall at x=10 is not off-screen');
  
  const wall3 = new Wall(-61, 200, 150, 60);
  assert(wall3.isOffScreen(), 'Wall at x=-61 is off-screen');
  
  // Test getBounds
  const wall4 = new Wall(200, 320, 150, 60);
  const bounds = wall4.getBounds();
  assert(bounds.top !== undefined, 'getBounds returns top rectangle');
  assert(bounds.bottom !== undefined, 'getBounds returns bottom rectangle');
  assert(bounds.top.x === 200, 'Top wall x position is correct');
  assert(bounds.top.y === 0, 'Top wall starts at y=0');
  assert(bounds.top.height === 245, 'Top wall height is correct (320 - 75)');
  assert(bounds.bottom.y === 395, 'Bottom wall starts at correct y (320 + 75)');
}

// Test WallManager
function testWallManager() {
  testSection('WallManager Tests');
  
  const manager = new WallManager(480, 640);
  
  // Test initial properties
  assert(manager.canvasWidth === 480, 'Canvas width is correct');
  assert(manager.canvasHeight === 640, 'Canvas height is correct');
  assert(manager.walls.length === 0, 'Initial walls array is empty');
  assert(manager.framesSinceLastWall === 0, 'Initial frame counter is 0');
  
  // Test generateWall
  manager.generateWall();
  assert(manager.walls.length === 1, 'generateWall() adds one wall');
  assert(manager.walls[0].x === 480, 'Generated wall spawns at canvas width');
  assert(manager.walls[0].gapY >= 75 && manager.walls[0].gapY <= 565, 'Gap Y is within valid bounds');
  
  // Test update - wall movement
  const initialX = manager.walls[0].x;
  manager.update();
  assert(manager.walls[0].x === initialX - 3, 'update() moves walls left');
  assert(manager.framesSinceLastWall === 1, 'update() increments frame counter');
  
  // Test update - wall spawning
  const manager2 = new WallManager(480, 640);
  for (let i = 0; i < 90; i++) {
    manager2.update();
  }
  assert(manager2.walls.length === 1, 'Wall spawns at interval (90 frames)');
  assert(manager2.framesSinceLastWall === 0, 'Frame counter resets after spawn');
  
  // Test removeOffScreenWalls
  const manager3 = new WallManager(480, 640);
  manager3.generateWall();
  manager3.walls[0].x = -100;
  manager3.removeOffScreenWalls();
  assert(manager3.walls.length === 0, 'removeOffScreenWalls() removes off-screen walls');
  
  // Test reset
  const manager4 = new WallManager(480, 640);
  for (let i = 0; i < 100; i++) {
    manager4.update();
  }
  manager4.reset();
  assert(manager4.walls.length === 0, 'reset() clears all walls');
  assert(manager4.framesSinceLastWall === 0, 'reset() resets frame counter');
}

// Test ScoreTracker
function testScoreTracker() {
  testSection('ScoreTracker Tests');
  
  const tracker = new ScoreTracker();
  
  // Test initial state
  assert(tracker.getScore() === 0, 'Initial score is 0');
  
  // Test increment
  tracker.increment();
  assert(tracker.getScore() === 1, 'increment() increases score by 1');
  
  tracker.increment();
  tracker.increment();
  assert(tracker.getScore() === 3, 'Multiple increments accumulate correctly');
  
  // Test reset
  tracker.reset();
  assert(tracker.getScore() === 0, 'reset() sets score to 0');
}

// Run all tests
console.log('='.repeat(60));
console.log('FLAPPY KIRO - UNIT TEST SUITE');
console.log('='.repeat(60));

try {
  testGameState();
  testPhysics();
  testGhosty();
  testCollisionDetector();
  testWall();
  testWallManager();
  testScoreTracker();
  
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✓ Passed: ${testsPassed}`);
  console.log(`✗ Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 ALL UNIT TESTS PASSED!');
    console.log('All core game logic is working correctly.');
  } else {
    console.error('\n❌ SOME TESTS FAILED');
    console.error('Please review the failures above.');
  }
  console.log('='.repeat(60));
  
  process.exit(testsFailed === 0 ? 0 : 1);
} catch (error) {
  console.error('\n❌ TEST SUITE ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}
