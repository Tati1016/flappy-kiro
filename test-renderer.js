/**
 * Renderer Module Test Suite
 * Tests the Renderer class structure and method existence
 */

import { Renderer } from './renderer.js';
import { GameState } from './gameState.js';
import { Ghosty } from './ghosty.js';
import { Wall } from './wall.js';

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

// Mock canvas and context for testing
class MockCanvas {
  constructor() {
    this.width = 480;
    this.height = 640;
  }
}

class MockContext {
  constructor() {
    this.fillStyle = '';
    this.strokeStyle = '';
    this.lineWidth = 0;
    this.font = '';
    this.textAlign = '';
    this.textBaseline = '';
  }
  
  fillRect() {}
  strokeRect() {}
  fillText() {}
  strokeText() {}
  drawImage() {}
}

function testRendererStructure() {
  testSection('Renderer Structure Tests');
  
  const mockCanvas = new MockCanvas();
  const mockContext = new MockContext();
  const renderer = new Renderer(mockCanvas, mockContext);
  
  // Test constructor
  assert(renderer.canvas === mockCanvas, 'Constructor stores canvas reference');
  assert(renderer.ctx === mockContext, 'Constructor stores context reference');
  
  // Test method existence
  assert(typeof renderer.clear === 'function', 'clear() method exists');
  assert(typeof renderer.drawGhosty === 'function', 'drawGhosty() method exists');
  assert(typeof renderer.drawWall === 'function', 'drawWall() method exists');
  assert(typeof renderer.drawScore === 'function', 'drawScore() method exists');
  assert(typeof renderer.drawStartScreen === 'function', 'drawStartScreen() method exists');
  assert(typeof renderer.drawGameOverScreen === 'function', 'drawGameOverScreen() method exists');
  assert(typeof renderer.render === 'function', 'render() method exists');
}

function testRendererMethods() {
  testSection('Renderer Method Execution Tests');
  
  const mockCanvas = new MockCanvas();
  const mockContext = new MockContext();
  const renderer = new Renderer(mockCanvas, mockContext);
  
  try {
    // Test clear
    renderer.clear();
    assert(true, 'clear() executes without error');
  } catch (error) {
    assert(false, `clear() throws error: ${error.message}`);
  }
  
  try {
    // Test drawGhosty with fallback (no sprite)
    const ghosty = new Ghosty(100, 100, 40, 40);
    renderer.drawGhosty(ghosty);
    assert(true, 'drawGhosty() executes without error (fallback rendering)');
  } catch (error) {
    assert(false, `drawGhosty() throws error: ${error.message}`);
  }
  
  try {
    // Test drawWall
    const wall = new Wall(200, 300, 150, 60);
    renderer.drawWall(wall);
    assert(true, 'drawWall() executes without error');
  } catch (error) {
    assert(false, `drawWall() throws error: ${error.message}`);
  }
  
  try {
    // Test drawScore
    renderer.drawScore(42);
    assert(true, 'drawScore() executes without error');
  } catch (error) {
    assert(false, `drawScore() throws error: ${error.message}`);
  }
  
  try {
    // Test drawStartScreen
    renderer.drawStartScreen();
    assert(true, 'drawStartScreen() executes without error');
  } catch (error) {
    assert(false, `drawStartScreen() throws error: ${error.message}`);
  }
  
  try {
    // Test drawGameOverScreen
    renderer.drawGameOverScreen(99);
    assert(true, 'drawGameOverScreen() executes without error');
  } catch (error) {
    assert(false, `drawGameOverScreen() throws error: ${error.message}`);
  }
}

function testRenderMethod() {
  testSection('Render Method Integration Tests');
  
  const mockCanvas = new MockCanvas();
  const mockContext = new MockContext();
  const renderer = new Renderer(mockCanvas, mockContext);
  
  // Test render with START state
  try {
    const gameState = new GameState();
    const ghosty = new Ghosty();
    const walls = [];
    const score = 0;
    
    renderer.render(gameState, ghosty, walls, score);
    assert(true, 'render() works with START state');
  } catch (error) {
    assert(false, `render() with START state throws error: ${error.message}`);
  }
  
  // Test render with PLAYING state
  try {
    const gameState = new GameState();
    gameState.setState('PLAYING');
    const ghosty = new Ghosty(100, 200, 40, 40);
    const walls = [
      new Wall(300, 200, 150, 60),
      new Wall(450, 350, 150, 60)
    ];
    const score = 5;
    
    renderer.render(gameState, ghosty, walls, score);
    assert(true, 'render() works with PLAYING state and multiple walls');
  } catch (error) {
    assert(false, `render() with PLAYING state throws error: ${error.message}`);
  }
  
  // Test render with GAME_OVER state
  try {
    const gameState = new GameState();
    gameState.setState('PLAYING');
    gameState.setState('GAME_OVER');
    const ghosty = new Ghosty(100, 500, 40, 40);
    const walls = [new Wall(200, 300, 150, 60)];
    const score = 12;
    
    renderer.render(gameState, ghosty, walls, score);
    assert(true, 'render() works with GAME_OVER state');
  } catch (error) {
    assert(false, `render() with GAME_OVER state throws error: ${error.message}`);
  }
}

function testFallbackRendering() {
  testSection('Fallback Rendering Tests');
  
  const mockCanvas = new MockCanvas();
  const mockContext = new MockContext();
  const renderer = new Renderer(mockCanvas, mockContext);
  
  // Test with null sprite
  try {
    const ghosty = new Ghosty(100, 100, 40, 40);
    ghosty.sprite = null;
    renderer.drawGhosty(ghosty);
    assert(true, 'drawGhosty() handles null sprite (fallback rendering)');
  } catch (error) {
    assert(false, `drawGhosty() with null sprite throws error: ${error.message}`);
  }
  
  // Test with incomplete sprite
  try {
    const ghosty = new Ghosty(100, 100, 40, 40);
    ghosty.sprite = { complete: false, naturalWidth: 0 };
    renderer.drawGhosty(ghosty);
    assert(true, 'drawGhosty() handles incomplete sprite (fallback rendering)');
  } catch (error) {
    assert(false, `drawGhosty() with incomplete sprite throws error: ${error.message}`);
  }
}

// Run all tests
function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('FLAPPY KIRO - RENDERER TEST SUITE');
  console.log('='.repeat(60));

  try {
    testRendererStructure();
    testRendererMethods();
    testRenderMethod();
    testFallbackRendering();

    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Passed: ${testsPassed}`);
    console.log(`✗ Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Renderer module is working correctly.');
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
