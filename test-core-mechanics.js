/**
 * Core Mechanics Test Suite for Flappy Kiro
 * Tests GameState, Physics, Ghosty, and CollisionDetector modules
 */

// Mock browser environment for ES modules
import { GameState } from './gameState.js';
import { Ghosty } from './ghosty.js';
import { CollisionDetector } from './collision.js';
import { Physics } from './physics.js';

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
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${title}`);
  console.log('='.repeat(60));
}

// Test GameState
function testGameState() {
  testSection('GameState Tests');
  const state = new GameState();

  // Test initial state
  assert(state.getCurrentState() === 'START', 'Initial state is START');
  assert(state.isStart(), 'isStart() returns true');
  assert(!state.isPlaying(), 'isPlaying() returns false initially');
  assert(!state.isGameOver(), 'isGameOver() returns false initially');

  // Test valid transition START -> PLAYING
  state.setState('PLAYING');
  assert(state.getCurrentState() === 'PLAYING', 'Transition START -> PLAYING');
  assert(state.isPlaying(), 'isPlaying() returns true');
  assert(!state.isStart(), 'isStart() returns false after transition');

  // Test valid transition PLAYING -> GAME_OVER
  state.setState('GAME_OVER');
  assert(state.getCurrentState() === 'GAME_OVER', 'Transition PLAYING -> GAME_OVER');
  assert(state.isGameOver(), 'isGameOver() returns true');
  assert(!state.isPlaying(), 'isPlaying() returns false after game over');

  // Test valid transition GAME_OVER -> START
  state.setState('START');
  assert(state.getCurrentState() === 'START', 'Transition GAME_OVER -> START');

  // Test invalid transition (should be rejected)
  const beforeState = state.getCurrentState();
  state.setState('GAME_OVER'); // Invalid: START -> GAME_OVER
  assert(state.getCurrentState() === beforeState, 'Invalid transition rejected (START -> GAME_OVER)');

  // Test reset
  state.setState('PLAYING');
  state.setState('GAME_OVER');
  state.reset();
  assert(state.getCurrentState() === 'START', 'Reset returns to START');
}

// Test Physics
function testPhysics() {
  testSection('Physics Tests');
  const physics = new Physics(0.6, -10, 12);
  const ghosty = new Ghosty(100, 200, 40, 40);

  // Test applyGravity
  ghosty.velocity = 0;
  physics.applyGravity(ghosty);
  assert(ghosty.velocity === 0.6, 'applyGravity increases velocity by GRAVITY (0.6)');

  ghosty.velocity = 5;
  physics.applyGravity(ghosty);
  assert(ghosty.velocity === 5.6, 'applyGravity accumulates velocity');

  // Test applyJump
  physics.applyJump(ghosty);
  assert(ghosty.velocity === -10, 'applyJump sets velocity to JUMP_VELOCITY (-10)');

  // Test clampVelocity
  ghosty.velocity = 15; // Above max
  physics.clampVelocity(ghosty);
  assert(ghosty.velocity === 12, 'clampVelocity limits to MAX_FALL_VELOCITY (12)');

  ghosty.velocity = 5;
  physics.clampVelocity(ghosty);
  assert(ghosty.velocity === 5, 'clampVelocity preserves normal velocity');

  ghosty.velocity = -5; // Negative (upward) velocity
  physics.clampVelocity(ghosty);
  assert(ghosty.velocity === -5, 'clampVelocity does not affect upward velocity');

  // Test updatePosition
  ghosty.y = 100;
  ghosty.velocity = 10;
  physics.updatePosition(ghosty, 1.0);
  assert(ghosty.y === 110, 'updatePosition updates y by velocity (deltaTime=1.0)');

  ghosty.y = 100;
  ghosty.velocity = 10;
  physics.updatePosition(ghosty, 2.0);
  assert(ghosty.y === 120, 'updatePosition respects deltaTime (deltaTime=2.0)');

  ghosty.y = 100;
  ghosty.velocity = -5;
  physics.updatePosition(ghosty, 1.0);
  assert(ghosty.y === 95, 'updatePosition handles negative velocity (upward movement)');

  // Test defensive validation
  const originalVelocity = ghosty.velocity;
  physics.applyGravity(null);
  physics.applyJump(null);
  physics.clampVelocity(null);
  physics.updatePosition(null, 1.0);
  assert(ghosty.velocity === originalVelocity, 'Handles null entities gracefully');
}

// Test Ghosty
function testGhosty() {
  testSection('Ghosty Tests');
  const ghosty = new Ghosty(100, 200, 40, 40);

  // Test initial properties
  assert(ghosty.x === 100, 'Initial position x=100');
  assert(ghosty.y === 200, 'Initial position y=200');
  assert(ghosty.width === 40, 'Width is 40');
  assert(ghosty.height === 40, 'Height is 40');
  assert(ghosty.velocity === 0, 'Initial velocity is 0');
  assert(ghosty.sprite === null, 'Initial sprite is null');

  // Test getBounds
  const bounds = ghosty.getBounds();
  assert(bounds.x === 100, 'getBounds returns correct x');
  assert(bounds.y === 200, 'getBounds returns correct y');
  assert(bounds.width === 40, 'getBounds returns correct width');
  assert(bounds.height === 40, 'getBounds returns correct height');

  // Test that getBounds reflects current position
  ghosty.x = 150;
  ghosty.y = 250;
  const newBounds = ghosty.getBounds();
  assert(newBounds.x === 150, 'getBounds reflects updated x position');
  assert(newBounds.y === 250, 'getBounds reflects updated y position');

  // Test reset
  ghosty.x = 300;
  ghosty.y = 400;
  ghosty.velocity = 10;
  ghosty.reset();
  assert(ghosty.x === 100, 'Reset restores x position');
  assert(ghosty.y === 200, 'Reset restores y position');
  assert(ghosty.velocity === 0, 'Reset clears velocity');
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

  // Test rectanglesIntersect - edge touching (should NOT intersect)
  const rect5 = { x: 0, y: 0, width: 10, height: 10 };
  const rect6 = { x: 10, y: 0, width: 10, height: 10 };
  assert(!detector.rectanglesIntersect(rect5, rect6), 'Edge-touching rectangles do not intersect');

  // Test rectanglesIntersect - partial overlap
  const rect7 = { x: 0, y: 0, width: 10, height: 10 };
  const rect8 = { x: 9, y: 0, width: 10, height: 10 };
  assert(detector.rectanglesIntersect(rect7, rect8), 'Detects partial overlap');

  // Test rectanglesIntersect - one inside another
  const rect9 = { x: 0, y: 0, width: 20, height: 20 };
  const rect10 = { x: 5, y: 5, width: 5, height: 5 };
  assert(detector.rectanglesIntersect(rect9, rect10), 'Detects rectangle inside another');

  // Test checkBoundaryCollision - above screen
  const ghosty1 = { y: -10, height: 40 };
  assert(detector.checkBoundaryCollision(ghosty1, 640), 'Detects Ghosty above screen (y=-10)');

  const ghosty2 = { y: -1, height: 40 };
  assert(detector.checkBoundaryCollision(ghosty2, 640), 'Detects Ghosty partially above screen (y=-1)');

  // Test checkBoundaryCollision - below screen
  const ghosty3 = { y: 620, height: 40 };
  assert(detector.checkBoundaryCollision(ghosty3, 640), 'Detects Ghosty below screen (y=620, height=40)');

  const ghosty4 = { y: 600, height: 40 };
  assert(!detector.checkBoundaryCollision(ghosty4, 640), 'Ghosty at bottom edge is within bounds (y=600, height=40)');

  const ghosty5 = { y: 601, height: 40 };
  assert(detector.checkBoundaryCollision(ghosty5, 640), 'Detects Ghosty partially below screen (y=601)');

  // Test checkBoundaryCollision - within bounds
  const ghosty6 = { y: 300, height: 40 };
  assert(!detector.checkBoundaryCollision(ghosty6, 640), 'Ghosty within bounds (y=300)');

  const ghosty7 = { y: 0, height: 40 };
  assert(!detector.checkBoundaryCollision(ghosty7, 640), 'Ghosty at top edge is within bounds (y=0)');

  // Test defensive validation
  assert(!detector.rectanglesIntersect(null, rect1), 'Handles null first rectangle');
  assert(!detector.rectanglesIntersect(rect1, null), 'Handles null second rectangle');
  assert(!detector.rectanglesIntersect(null, null), 'Handles both null rectangles');
  assert(!detector.checkBoundaryCollision(null, 640), 'Handles null Ghosty in boundary check');
  assert(!detector.checkBoundaryCollision(ghosty6, 0), 'Handles invalid canvas height');

  // Test checkWallCollision with mock wall
  const ghosty = new Ghosty(100, 100, 40, 40);
  const mockWall = {
    getBounds: () => ({
      top: { x: 120, y: 0, width: 60, height: 80 },
      bottom: { x: 120, y: 230, width: 60, height: 410 }
    })
  };

  // Ghosty collides with top wall
  ghosty.y = 50;
  assert(detector.checkWallCollision(ghosty, mockWall), 'Detects collision with top wall section');

  // Ghosty collides with bottom wall
  ghosty.y = 250;
  assert(detector.checkWallCollision(ghosty, mockWall), 'Detects collision with bottom wall section');

  // Ghosty passes through gap
  ghosty.y = 150;
  assert(!detector.checkWallCollision(ghosty, mockWall), 'No collision when Ghosty in gap');

  // Test defensive validation for checkWallCollision
  assert(!detector.checkWallCollision(null, mockWall), 'Handles null Ghosty in wall collision');
  assert(!detector.checkWallCollision(ghosty, null), 'Handles null wall in wall collision');
}

// Run all tests
function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('FLAPPY KIRO - CORE MECHANICS TEST SUITE');
  console.log('='.repeat(60));

  try {
    testGameState();
    testPhysics();
    testGhosty();
    testCollisionDetector();

    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Passed: ${testsPassed}`);
    console.log(`✗ Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Core mechanics are working correctly.');
      process.exit(0);
    } else {
      console.log('\n❌ SOME TESTS FAILED. Please review the failures above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ TEST SUITE ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runAllTests();
