const Physics = require('../src/Physics');

function makeFruit(x, y, vx, vy, radius = 20) {
  return { x, y, vx, vy, radius };
}

describe('Physics', () => {
  let physics;

  beforeEach(() => {
    physics = new Physics();
  });

  // Test 1: Gravity application - consistent acceleration
  test('applyGravity increases vy by gravity each frame', () => {
    const fruit = makeFruit(100, 100, 0, 0);
    physics.applyGravity(fruit);
    expect(fruit.vy).toBe(0.5);
    physics.applyGravity(fruit);
    expect(fruit.vy).toBe(1.0);
    physics.applyGravity(fruit);
    expect(fruit.vy).toBeCloseTo(1.5);
  });

  // Test 2: Friction applies ONLY to vx, not vy
  test('applyFriction modifies vx but NOT vy', () => {
    const fruit = makeFruit(100, 100, 10, 10);
    physics.applyFriction(fruit);
    expect(fruit.vx).toBeCloseTo(10 * 0.75);
    // vy must remain exactly 10 (friction not applied)
    expect(fruit.vy).toBe(10);
  });

  // Test 3: Friction zeroes out vx below velocity threshold
  test('applyFriction zeroes vx when below velocityThreshold', () => {
    const fruit = makeFruit(100, 100, 0.05, 5);
    physics.applyFriction(fruit);
    expect(fruit.vx).toBe(0);
    // vy above threshold: not zeroed
    expect(fruit.vy).toBe(5);
  });

  // Test 4: Friction zeroes vy when below threshold, but does not scale it
  test('applyFriction zeroes vy when below velocityThreshold without scaling', () => {
    const fruit = makeFruit(100, 100, 5, 0.05);
    physics.applyFriction(fruit);
    // vy was tiny so gets zeroed
    expect(fruit.vy).toBe(0);
    // vx gets friction applied normally
    expect(fruit.vx).toBeCloseTo(5 * 0.75);
  });

  // Test 5: Collision response - vector impulse applied
  test('resolveCollision applies equal/opposite impulses along collision normal', () => {
    const fruit1 = makeFruit(0, 0, 5, 0);
    const fruit2 = makeFruit(30, 0, -5, 0);
    physics.resolveCollision(fruit1, fruit2);
    // fruit1 was moving right (+vx), should lose x velocity
    expect(fruit1.vx).toBeLessThan(5);
    // fruit2 was moving left (-vx), should gain x velocity (become less negative)
    expect(fruit2.vx).toBeGreaterThan(-5);
    // Impulses should be equal/opposite in magnitude
    const dvx1 = 5 - fruit1.vx;
    const dvx2 = fruit2.vx - (-5);
    expect(dvx1).toBeCloseTo(dvx2);
  });

  // Test 6: Fruit separation - no overlap after separateFruits
  test('separateFruits moves fruits apart to eliminate overlap', () => {
    const fruit1 = makeFruit(100, 100, 0, 0, 20);
    const fruit2 = makeFruit(110, 100, 0, 0, 20); // overlapping: distance 10 < 40
    physics.separateFruits(fruit1, fruit2);
    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    expect(distance).toBeCloseTo(40); // sum of radii
  });

  // Test 7: Boundary collision - floor bounce
  test('handleBoundaryCollision bounces off floor', () => {
    const fruit = makeFruit(200, 590, 0, 5, 20);
    physics.handleBoundaryCollision(fruit, 400, 600);
    expect(fruit.y).toBe(580); // canvasHeight - radius
    expect(fruit.vy).toBeLessThan(0); // bounced upward
  });

  // Test 8: Boundary collision - left/right walls, no ceiling bounce
  test('handleBoundaryCollision bounces off walls but NOT ceiling', () => {
    // Left wall
    const fruitLeft = makeFruit(5, 300, -5, 0, 20);
    physics.handleBoundaryCollision(fruitLeft, 400, 600);
    expect(fruitLeft.x).toBe(20);
    expect(fruitLeft.vx).toBeGreaterThan(0);

    // Right wall
    const fruitRight = makeFruit(390, 300, 5, 0, 20);
    physics.handleBoundaryCollision(fruitRight, 400, 600);
    expect(fruitRight.x).toBe(380);
    expect(fruitRight.vx).toBeLessThan(0);

    // Above canvas (ceiling) - should NOT bounce, fruit stays above
    const fruitAbove = makeFruit(200, -30, 0, -5, 20);
    const vyBefore = fruitAbove.vy;
    physics.handleBoundaryCollision(fruitAbove, 400, 600);
    expect(fruitAbove.y).toBe(-30); // unchanged
    expect(fruitAbove.vy).toBe(vyBefore); // vy unchanged - no ceiling bounce
  });

  // Test 9: Multiple collision handling - resolveCollision ignores separating fruits
  test('resolveCollision does not modify velocities when fruits are separating', () => {
    // Fruits moving away from each other
    const fruit1 = makeFruit(0, 0, -5, 0);
    const fruit2 = makeFruit(30, 0, 5, 0);
    const vx1Before = fruit1.vx;
    const vx2Before = fruit2.vx;
    physics.resolveCollision(fruit1, fruit2);
    // Velocities should be unchanged (already separating)
    expect(fruit1.vx).toBe(vx1Before);
    expect(fruit2.vx).toBe(vx2Before);
  });

  // Test 10: Stacked fruit micro-vibration resistance via velocity threshold
  test('applyFriction prevents micro-vibration by zeroing near-zero velocities', () => {
    // Simulate stacked fruit with tiny residual velocities
    const fruit = makeFruit(100, 100, 0.08, 0.08);
    physics.applyFriction(fruit);
    // vx: 0.08 * 0.75 = 0.06 < 0.1 threshold -> zeroed
    expect(fruit.vx).toBe(0);
    // vy: 0.08 is below threshold -> zeroed
    expect(fruit.vy).toBe(0);
  });
});
