/**
 * WallManager Test Suite for Flappy Kiro
 * Tests WallManager module
 */

import { WallManager } from './wallManager.js';

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

// Test WallManager
function testWallManager() {
  testSection('WallManager Tests');

  // Test constructor and initial properties
  const manager = new WallManager(480, 640);
  assert(manager.canvasWidth === 480, 'Canvas width is 480');
  assert(manager.canvasHeight === 640, 'Canvas height is 640');
  assert(manager.walls.length === 0, 'Initial walls array is empty');
  assert(manager.framesSinceLastWall === 0, 'Initial frame counter is 0');
  assert(manager.WALL_SPAWN_INTERVAL === 90, 'Spawn interval is 90 frames');
  assert(manager.GAP_HEIGHT === 150, 'Gap height is 150 pixels');
  assert(manager.WALL_WIDTH === 60, 'Wall width is 60 pixels');

  // Test valid bounds calculation
  assert(manager.MIN_GAP_Y === 75, 'MIN_GAP_Y is GAP_HEIGHT/2 (150/2 = 75)');
  assert(manager.MAX_GAP_Y === 565, 'MAX_GAP_Y is canvasHeight - GAP_HEIGHT/2 (640 - 75 = 565)');

  // Test generateWall method
  const manager2 = new WallManager(480, 640);
  manager2.generateWall();
  assert(manager2.walls.length === 1, 'generateWall() adds one wall to array');
  
  const wall = manager2.walls[0];
  assert(wall.x === 480, 'Generated wall spawns at canvas width (480)');
  assert(wall.gapY >= 75 && wall.gapY <= 565, `Gap Y is within valid bounds (${wall.gapY} between 75 and 565)`);
  assert(wall.gapHeight === 150, 'Generated wall has correct gap height');
  assert(wall.width === 60, 'Generated wall has correct width');

  // Test multiple wall generation produces random gap positions
  const manager3 = new WallManager(480, 640);
  const gapPositions = [];
  for (let i = 0; i < 10; i++) {
    manager3.generateWall();
    gapPositions.push(manager3.walls[i].gapY);
  }
  const allSame = gapPositions.every(gap => gap === gapPositions[0]);
  assert(!allSame, 'Multiple walls have different random gap positions');
  assert(manager3.walls.length === 10, 'generateWall() can be called multiple times');

  // Test update method - wall movement
  const manager4 = new WallManager(480, 640);
  manager4.generateWall();
  const initialX = manager4.walls[0].x;
  manager4.update();
  assert(manager4.walls[0].x === initialX - 3, 'update() moves walls left by speed (3 pixels)');
  assert(manager4.framesSinceLastWall === 1, 'update() increments frame counter');

  // Test update method - wall spawning at interval
  const manager5 = new WallManager(480, 640);
  for (let i = 0; i < 89; i++) {
    manager5.update();
  }
  assert(manager5.walls.length === 0, 'No walls spawn before interval (89 frames)');
  assert(manager5.framesSinceLastWall === 89, 'Frame counter is 89');
  
  manager5.update(); // 90th frame
  assert(manager5.walls.length === 1, 'Wall spawns at interval (90 frames)');
  assert(manager5.framesSinceLastWall === 0, 'Frame counter resets after spawn');

  // Test update method - continuous spawning
  const manager6 = new WallManager(480, 640);
  for (let i = 0; i < 180; i++) {
    manager6.update();
  }
  assert(manager6.walls.length === 2, 'Multiple walls spawn at intervals (180 frames = 2 walls)');

  // Test removeOffScreenWalls method
  const manager7 = new WallManager(480, 640);
  manager7.generateWall();
  manager7.walls[0].x = -100; // Move wall off-screen
  manager7.removeOffScreenWalls();
  assert(manager7.walls.length === 0, 'removeOffScreenWalls() removes off-screen walls');

  // Test removeOffScreenWalls keeps visible walls
  const manager8 = new WallManager(480, 640);
  manager8.generateWall();
  manager8.generateWall();
  manager8.walls[0].x = -100; // Off-screen
  manager8.walls[1].x = 200; // Visible
  manager8.removeOffScreenWalls();
  assert(manager8.walls.length === 1, 'removeOffScreenWalls() keeps visible walls');
  assert(manager8.walls[0].x === 200, 'Remaining wall is the visible one');

  // Test update method integrates removeOffScreenWalls
  // Note: update() moves walls by 3 pixels THEN removes off-screen walls
  const manager9 = new WallManager(480, 640);
  manager9.generateWall();
  manager9.walls[0].x = -56; // After update: -59, right edge at 1 (still visible)
  manager9.update();
  assert(manager9.walls.length === 1, 'update() keeps barely visible walls (x=-56 -> -59)');
  
  const manager9b = new WallManager(480, 640);
  manager9b.generateWall();
  manager9b.walls[0].x = -57; // After update: -60, right edge at 0 (at edge)
  manager9b.update();
  assert(manager9b.walls.length === 1, 'update() keeps walls at edge (x=-57 -> -60)');
  
  const manager9c = new WallManager(480, 640);
  manager9c.generateWall();
  manager9c.walls[0].x = -58; // After update: -61, right edge at -1 (off-screen)
  manager9c.update();
  assert(manager9c.walls.length === 0, 'update() removes off-screen walls (x=-58 -> -61)');

  // Test reset method
  const manager10 = new WallManager(480, 640);
  for (let i = 0; i < 100; i++) {
    manager10.update();
  }
  assert(manager10.walls.length > 0, 'Walls exist before reset');
  assert(manager10.framesSinceLastWall > 0, 'Frame counter is non-zero before reset');
  
  manager10.reset();
  assert(manager10.walls.length === 0, 'reset() clears all walls');
  assert(manager10.framesSinceLastWall === 0, 'reset() resets frame counter');

  // Test reset can be called multiple times
  manager10.reset();
  assert(manager10.walls.length === 0, 'reset() can be called on empty manager');
}

// Run all tests
function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('FLAPPY KIRO - WALLMANAGER TEST SUITE');
  console.log('='.repeat(60));

  try {
    testWallManager();

    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Passed: ${testsPassed}`);
    console.log(`✗ Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! WallManager is working correctly.');
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
