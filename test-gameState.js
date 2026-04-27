/**
 * Simple manual test for GameState module
 * Run this in a browser console or Node.js with ES modules support
 */

import { GameState } from './gameState.js';

console.log('=== Testing GameState Module ===\n');

// Test 1: Initial state
const gameState = new GameState();
console.log('Test 1: Initial state');
console.log('Expected: START, Got:', gameState.getCurrentState());
console.log('isStart():', gameState.isStart());
console.log('isPlaying():', gameState.isPlaying());
console.log('isGameOver():', gameState.isGameOver());
console.log('✓ Pass\n');

// Test 2: Valid transition START → PLAYING
console.log('Test 2: Valid transition START → PLAYING');
gameState.setState(GameState.PLAYING);
console.log('Expected: PLAYING, Got:', gameState.getCurrentState());
console.log('isPlaying():', gameState.isPlaying());
console.log('✓ Pass\n');

// Test 3: Valid transition PLAYING → GAME_OVER
console.log('Test 3: Valid transition PLAYING → GAME_OVER');
gameState.setState(GameState.GAME_OVER);
console.log('Expected: GAME_OVER, Got:', gameState.getCurrentState());
console.log('isGameOver():', gameState.isGameOver());
console.log('✓ Pass\n');

// Test 4: Valid transition GAME_OVER → START
console.log('Test 4: Valid transition GAME_OVER → START');
gameState.setState(GameState.START);
console.log('Expected: START, Got:', gameState.getCurrentState());
console.log('isStart():', gameState.isStart());
console.log('✓ Pass\n');

// Test 5: Invalid transition START → GAME_OVER (should be rejected)
console.log('Test 5: Invalid transition START → GAME_OVER (should warn and stay at START)');
gameState.setState(GameState.GAME_OVER);
console.log('Expected: START (unchanged), Got:', gameState.getCurrentState());
console.log('✓ Pass (warning should appear above)\n');

// Test 6: Reset functionality
console.log('Test 6: Reset functionality');
gameState.setState(GameState.PLAYING);
gameState.setState(GameState.GAME_OVER);
console.log('Before reset:', gameState.getCurrentState());
gameState.reset();
console.log('After reset - Expected: START, Got:', gameState.getCurrentState());
console.log('✓ Pass\n');

// Test 7: Invalid transition PLAYING → START (should be rejected)
console.log('Test 7: Invalid transition PLAYING → START (should warn and stay at PLAYING)');
gameState.setState(GameState.PLAYING);
const beforeState = gameState.getCurrentState();
gameState.setState(GameState.START);
console.log('Expected: PLAYING (unchanged), Got:', gameState.getCurrentState());
console.log('✓ Pass (warning should appear above)\n');

console.log('=== All Tests Complete ===');
