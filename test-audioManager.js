/**
 * AudioManager Test Suite for Flappy Kiro
 * Tests AudioManager module
 */

import { AudioManager } from './audioManager.js';

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

// Mock Audio element for testing
class MockAudio {
  constructor() {
    this.currentTime = 0;
    this.playCount = 0;
    this.playError = null;
  }

  play() {
    this.playCount++;
    if (this.playError) {
      return Promise.reject(this.playError);
    }
    return Promise.resolve();
  }
}

// Test AudioManager
function testAudioManager() {
  testSection('AudioManager Tests');

  // Test constructor with valid audio assets
  const mockJump = new MockAudio();
  const mockGameOver = new MockAudio();
  const audioAssets = {
    jump: mockJump,
    gameOver: mockGameOver
  };
  const manager = new AudioManager(audioAssets);
  assert(manager.audioAssets === audioAssets, 'Constructor stores audio assets');
  assert(manager.enabled === true, 'Audio is enabled by default');

  // Test constructor with null/undefined
  const manager2 = new AudioManager(null);
  assert(manager2.audioAssets !== null, 'Constructor handles null audioAssets');
  assert(manager2.enabled === true, 'Audio is enabled by default even with null assets');

  const manager3 = new AudioManager();
  assert(manager3.audioAssets !== null, 'Constructor handles undefined audioAssets');

  // Test play() method with valid sound
  const manager4 = new AudioManager(audioAssets);
  manager4.play('jump');
  assert(mockJump.playCount === 1, 'play() calls audio.play() once');
  assert(mockJump.currentTime === 0, 'play() resets currentTime to 0');

  // Test play() method multiple times
  manager4.play('jump');
  assert(mockJump.playCount === 2, 'play() can be called multiple times');

  // Test play() with different sounds
  manager4.play('gameOver');
  assert(mockGameOver.playCount === 1, 'play() works with different sound names');

  // Test play() with non-existent sound (should be no-op)
  const beforeCount = mockJump.playCount;
  manager4.play('nonExistent');
  assert(mockJump.playCount === beforeCount, 'play() is no-op for non-existent sound');

  // Test play() with null audio element
  const audioAssetsWithNull = {
    jump: mockJump,
    missing: null
  };
  const manager5 = new AudioManager(audioAssetsWithNull);
  const beforeCount2 = mockJump.playCount;
  manager5.play('missing');
  assert(mockJump.playCount === beforeCount2, 'play() is no-op for null audio element');

  // Test play() when audio is disabled
  const manager6 = new AudioManager(audioAssets);
  manager6.setEnabled(false);
  const beforeCount3 = mockJump.playCount;
  manager6.play('jump');
  assert(mockJump.playCount === beforeCount3, 'play() is no-op when audio is disabled');

  // Test play() when audio is re-enabled
  manager6.setEnabled(true);
  manager6.play('jump');
  assert(mockJump.playCount === beforeCount3 + 1, 'play() works after re-enabling audio');

  // Test setEnabled() with boolean values
  const manager7 = new AudioManager(audioAssets);
  manager7.setEnabled(false);
  assert(manager7.enabled === false, 'setEnabled(false) disables audio');
  
  manager7.setEnabled(true);
  assert(manager7.enabled === true, 'setEnabled(true) enables audio');

  // Test setEnabled() with truthy/falsy values
  const manager8 = new AudioManager(audioAssets);
  manager8.setEnabled(0);
  assert(manager8.enabled === false, 'setEnabled(0) disables audio (falsy)');
  
  manager8.setEnabled(1);
  assert(manager8.enabled === true, 'setEnabled(1) enables audio (truthy)');
  
  manager8.setEnabled('');
  assert(manager8.enabled === false, 'setEnabled("") disables audio (falsy)');
  
  manager8.setEnabled('yes');
  assert(manager8.enabled === true, 'setEnabled("yes") enables audio (truthy)');

  // Test play() with audio that throws error
  const errorAudio = new MockAudio();
  errorAudio.playError = new Error('Autoplay blocked');
  const audioAssetsWithError = {
    blocked: errorAudio
  };
  const manager9 = new AudioManager(audioAssetsWithError);
  
  // Should not throw error, just log warning
  let errorThrown = false;
  try {
    manager9.play('blocked');
  } catch (error) {
    errorThrown = true;
  }
  assert(!errorThrown, 'play() handles audio.play() errors gracefully');
  assert(errorAudio.playCount === 1, 'play() attempts to play even if error occurs');

  // Test play() with undefined audioAssets
  const manager10 = new AudioManager();
  let errorThrown2 = false;
  try {
    manager10.play('anything');
  } catch (error) {
    errorThrown2 = true;
  }
  assert(!errorThrown2, 'play() handles undefined audioAssets gracefully');

  // Test play() resets currentTime for each play
  const mockAudio = new MockAudio();
  mockAudio.currentTime = 5.5;
  const manager11 = new AudioManager({ sound: mockAudio });
  manager11.play('sound');
  assert(mockAudio.currentTime === 0, 'play() resets currentTime before playing');
}

// Run all tests
function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('FLAPPY KIRO - AUDIOMANAGER TEST SUITE');
  console.log('='.repeat(60));

  try {
    testAudioManager();

    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Passed: ${testsPassed}`);
    console.log(`✗ Failed: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! AudioManager is working correctly.');
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
