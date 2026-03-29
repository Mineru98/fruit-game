class Physics {
  constructor(gravity = 0.5, friction = 0.75, velocityThreshold = 0.1, damping = 0.75) {
    this.gravity = gravity;
    this.friction = friction;
    this.velocityThreshold = velocityThreshold;
    this.damping = damping;
  }

  applyGravity(fruit) {
    fruit.vy += this.gravity;
  }

  applyFriction(fruit) {
    // Friction applies ONLY to horizontal velocity (vx), not vertical (vy)
    // This matches the original game design: "양옆 즉 S축" (horizontal axis only)
    fruit.vx *= this.friction;

    if (Math.abs(fruit.vx) < this.velocityThreshold) fruit.vx = 0;
    if (Math.abs(fruit.vy) < this.velocityThreshold) fruit.vy = 0;
  }

  resolveCollision(fruit1, fruit2) {
    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    // Normalized collision vector
    const nx = dx / distance;
    const ny = dy / distance;

    // Relative velocity in collision direction
    const dvx = fruit1.vx - fruit2.vx;
    const dvy = fruit1.vy - fruit2.vy;
    const relativeVelocity = dvx * nx + dvy * ny;

    // Only resolve if fruits are approaching each other
    if (relativeVelocity <= 0) return;

    // Impulse magnitude with damping coefficient
    const impulse = relativeVelocity * this.damping;

    // Apply equal/opposite impulses
    fruit1.vx -= impulse * nx;
    fruit1.vy -= impulse * ny;
    fruit2.vx += impulse * nx;
    fruit2.vy += impulse * ny;
  }

  separateFruits(fruit1, fruit2) {
    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = fruit1.radius + fruit2.radius;

    if (distance >= minDistance || distance === 0) return;

    // Calculate overlap amount
    const overlap = minDistance - distance;

    // Normalized direction
    const nx = dx / distance;
    const ny = dy / distance;

    // Move fruits apart 50/50 split
    fruit1.x -= nx * overlap * 0.5;
    fruit1.y -= ny * overlap * 0.5;
    fruit2.x += nx * overlap * 0.5;
    fruit2.y += ny * overlap * 0.5;
  }

  handleBoundaryCollision(fruit, canvasWidth, canvasHeight) {
    // Left wall
    if (fruit.x - fruit.radius < 0) {
      fruit.x = fruit.radius;
      fruit.vx = Math.abs(fruit.vx) * this.damping;
    }

    // Right wall
    if (fruit.x + fruit.radius > canvasWidth) {
      fruit.x = canvasWidth - fruit.radius;
      fruit.vx = -Math.abs(fruit.vx) * this.damping;
    }

    // Floor (bottom)
    if (fruit.y + fruit.radius > canvasHeight) {
      fruit.y = canvasHeight - fruit.radius;
      fruit.vy = -Math.abs(fruit.vy) * this.damping;
    }

    // NOTE: No ceiling bounce - fruits can go above play area (needed for game-over detection)
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Physics;
}
