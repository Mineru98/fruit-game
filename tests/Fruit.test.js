const Fruit = require('../src/Fruit');

describe('Fruit', () => {
  test('constructor sets initial properties correctly', () => {
    const fruit = new Fruit(100, 200, 1);
    expect(fruit.x).toBe(100);
    expect(fruit.y).toBe(200);
    expect(fruit.level).toBe(1);
    expect(fruit.vx).toBe(0);
    expect(fruit.vy).toBe(0);
    expect(fruit.isActive).toBe(true);
    expect(typeof fruit.createdAt).toBe('number');
  });

  test('radius is calculated correctly for level 1', () => {
    const fruit = new Fruit(0, 0, 1);
    expect(fruit.radius).toBe(15);
  });

  test('radius scales correctly with level', () => {
    const fruit3 = new Fruit(0, 0, 3);
    expect(fruit3.radius).toBe(25);
    const fruit6 = new Fruit(0, 0, 6);
    expect(fruit6.radius).toBe(40);
  });

  test('color is assigned from COLORS map', () => {
    const fruit = new Fruit(0, 0, 1);
    expect(fruit.color).toBe('#FF6B6B');
  });

  test('updatePosition adds velocity to position', () => {
    const fruit = new Fruit(10, 20, 1);
    fruit.vx = 3;
    fruit.vy = 4;
    fruit.updatePosition();
    expect(fruit.x).toBe(13);
    expect(fruit.y).toBe(24);
  });

  test('updatePosition does not move fruit when velocity is zero', () => {
    const fruit = new Fruit(50, 75, 1);
    fruit.updatePosition();
    expect(fruit.x).toBe(50);
    expect(fruit.y).toBe(75);
  });

  test('isCollidingWith returns true when fruits overlap', () => {
    const fruit1 = new Fruit(0, 0, 1);
    const fruit2 = new Fruit(20, 0, 1);
    expect(fruit1.isCollidingWith(fruit2)).toBe(true);
  });

  test('isCollidingWith returns false when fruits do not overlap', () => {
    const fruit1 = new Fruit(0, 0, 1);
    const fruit2 = new Fruit(100, 0, 1);
    expect(fruit1.isCollidingWith(fruit2)).toBe(false);
  });

  test('getScore returns correct score for level', () => {
    const fruit = new Fruit(0, 0, 3);
    expect(fruit.getScore()).toBe(Math.pow(2, 3) * 10);
  });

  test('level boundary values: level 1 and level 11 (watermelon)', () => {
    const fruitMin = new Fruit(0, 0, 1);
    expect(fruitMin.radius).toBe(15);
    expect(fruitMin.color).toBe('#FF6B6B');

    const fruitMax = new Fruit(0, 0, 11);
    expect(fruitMax.radius).toBe(65);
    expect(fruitMax.color).toBe('#2E8B57');
  });

  test('getNextLevel static method returns level + 1', () => {
    expect(Fruit.getNextLevel(1)).toBe(2);
    expect(Fruit.getNextLevel(5)).toBe(6);
    expect(Fruit.getNextLevel(10)).toBe(11);
  });
});
