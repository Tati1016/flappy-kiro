// Main entry point for Flappy Kiro game
// This file will be expanded in later tasks to include the full game loop

// Check for canvas support
const canvas = document.getElementById('gameCanvas');
const errorMessage = document.getElementById('errorMessage');

if (!canvas) {
  console.error('Canvas element not found');
  if (errorMessage) {
    errorMessage.classList.remove('hidden');
  }
} else {
  const context = canvas.getContext('2d');
  
  if (!context) {
    console.error('Canvas 2D context not supported');
    canvas.style.display = 'none';
    if (errorMessage) {
      errorMessage.classList.remove('hidden');
    }
  } else {
    // Canvas is supported - game initialization will happen here in later tasks
    console.log('Canvas initialized successfully');
    
    // Draw a simple test pattern to verify canvas is working
    context.fillStyle = '#87ceeb';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = '20px "Press Start 2P"';
    context.textAlign = 'center';
    context.fillText('Canvas Ready', canvas.width / 2, canvas.height / 2);
  }
}
