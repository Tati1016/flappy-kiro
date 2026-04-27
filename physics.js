/**
 * Physics Engine for Flappy Kiro
 * Handles gravity-based movement and velocity calculations with frame-rate independence
 */

export class Physics {
  /**
   * Creates a Physics engine with configurable constants
   * @param {number} gravity - Acceleration due to gravity (pixels/frame²)
   * @param {number} jumpVelocity - Initial upward velocity when jumping (pixels/frame)
   * @param {number} maxFallVelocity - Maximum downward velocity (pixels/frame)
   */
  constructor(gravity = 0.6, jumpVelocity = -10, maxFallVelocity = 12) {
    this.GRAVITY = gravity;
    this.JUMP_VELOCITY = jumpVelocity;
    this.MAX_FALL_VELOCITY = maxFallVelocity;
  }

  /**
   * Applies gravity to an entity, increasing its downward velocity
   * @param {Object} entity - Entity with a velocity property
   */
  applyGravity(entity) {
    if (!entity || typeof entity.velocity !== 'number') {
      console.warn('Invalid entity passed to applyGravity');
      return;
    }
    entity.velocity += this.GRAVITY;
  }

  /**
   * Applies jump force to an entity, setting its velocity to jump velocity
   * @param {Object} entity - Entity with a velocity property
   */
  applyJump(entity) {
    if (!entity || typeof entity.velocity !== 'number') {
      console.warn('Invalid entity passed to applyJump');
      return;
    }
    entity.velocity = this.JUMP_VELOCITY;
  }

  /**
   * Clamps entity velocity to prevent excessive fall speed
   * @param {Object} entity - Entity with a velocity property
   */
  clampVelocity(entity) {
    if (!entity || typeof entity.velocity !== 'number') {
      console.warn('Invalid entity passed to clampVelocity');
      return;
    }
    if (entity.velocity > this.MAX_FALL_VELOCITY) {
      entity.velocity = this.MAX_FALL_VELOCITY;
    }
  }

  /**
   * Updates entity position based on velocity with delta-time support for frame-rate independence
   * @param {Object} entity - Entity with velocity and y properties
   * @param {number} deltaTime - Time multiplier for frame-rate independence (1.0 = normal speed)
   */
  updatePosition(entity, deltaTime = 1.0) {
    if (!entity || typeof entity.velocity !== 'number' || typeof entity.y !== 'number') {
      console.warn('Invalid entity passed to updatePosition');
      return;
    }
    if (typeof deltaTime !== 'number' || deltaTime < 0) {
      console.warn('Invalid deltaTime passed to updatePosition');
      return;
    }
    entity.y += entity.velocity * deltaTime;
  }
}
