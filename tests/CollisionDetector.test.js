const CollisionDetector = require('../src/CollisionDetector');

describe('CollisionDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new CollisionDetector();
  });

  test('detectCollision returns true when fruits overlap (distance < r1 + r2)', () => {
    const fruit1 = { x: 0, y: 0, radius: 10, isActive: true };
    const fruit2 = { x: 15, y: 0, radius: 10, isActive: true };
    expect(detector.detectCollision(fruit1, fruit2)).toBe(true);
  });

  test('detectCollision returns false when fruits do not overlap (distance >= r1 + r2)', () => {
    const fruit1 = { x: 0, y: 0, radius: 10, isActive: true };
    const fruit2 = { x: 30, y: 0, radius: 10, isActive: true };
    expect(detector.detectCollision(fruit1, fruit2)).toBe(false);
  });

  test('findCollisions returns correct index pairs for colliding fruits', () => {
    const fruits = [
      { x: 0, y: 0, radius: 10, isActive: true },
      { x: 15, y: 0, radius: 10, isActive: true },
      { x: 100, y: 100, radius: 10, isActive: true },
    ];
    const pairs = detector.findCollisions(fruits);
    expect(pairs).toEqual([[0, 1]]);
  });

  test('findCollisions returns empty array when no fruits collide', () => {
    const fruits = [
      { x: 0, y: 0, radius: 5, isActive: true },
      { x: 100, y: 0, radius: 5, isActive: true },
      { x: 200, y: 0, radius: 5, isActive: true },
    ];
    const pairs = detector.findCollisions(fruits);
    expect(pairs).toEqual([]);
  });

  test('canMerge returns true for same-level colliding fruits', () => {
    const fruit1 = { x: 0, y: 0, radius: 10, level: 1, isActive: true };
    const fruit2 = { x: 15, y: 0, radius: 10, level: 1, isActive: true };
    expect(detector.canMerge(fruit1, fruit2)).toBe(true);
  });

  test('canMerge returns false for different-level fruits even when colliding', () => {
    const fruit1 = { x: 0, y: 0, radius: 10, level: 1, isActive: true };
    const fruit2 = { x: 15, y: 0, radius: 10, level: 2, isActive: true };
    expect(detector.canMerge(fruit1, fruit2)).toBe(false);
  });

  test('getMergePosition returns midpoint of two fruits', () => {
    const fruit1 = { x: 0, y: 0 };
    const fruit2 = { x: 20, y: 40 };
    const pos = detector.getMergePosition(fruit1, fruit2);
    expect(pos).toEqual({ x: 10, y: 20 });
  });

  test('getMergeVelocity returns average velocity of two fruits', () => {
    const fruit1 = { vx: 4, vy: -2 };
    const fruit2 = { vx: 2, vy: 6 };
    const vel = detector.getMergeVelocity(fruit1, fruit2);
    expect(vel).toEqual({ vx: 3, vy: 2 });
  });
});
