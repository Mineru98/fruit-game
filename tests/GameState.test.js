const GameState = require('../src/GameState');

describe('GameState', () => {
  let state;

  beforeEach(() => {
    state = new GameState();
  });

  test('addScore increments score correctly', () => {
    state.addScore(100);
    expect(state.score).toBe(100);
    state.addScore(50);
    expect(state.score).toBe(150);
  });

  test('addFruit adds fruit to the array', () => {
    const fruit = { x: 100, y: 200, isActive: true };
    state.addFruit(fruit);
    expect(state.fruits.length).toBe(1);
    expect(state.fruits[0]).toBe(fruit);
  });

  test('cleanup removes inactive fruits', () => {
    const activeFruit = { x: 100, y: 200, isActive: true };
    const inactiveFruit = { x: 150, y: 250, isActive: false };
    state.addFruit(activeFruit);
    state.addFruit(inactiveFruit);
    state.cleanup();
    expect(state.fruits.length).toBe(1);
    expect(state.fruits[0]).toBe(activeFruit);
  });

  test('getActiveFruits filters correctly', () => {
    const activeFruit = { x: 100, y: 200, isActive: true };
    const inactiveFruit = { x: 150, y: 250, isActive: false };
    state.addFruit(activeFruit);
    state.addFruit(inactiveFruit);
    const active = state.getActiveFruits();
    expect(active.length).toBe(1);
    expect(active[0]).toBe(activeFruit);
  });

  test('setGameOver toggles isGameOver flag to true', () => {
    expect(state.isGameOver).toBe(false);
    state.setGameOver();
    expect(state.isGameOver).toBe(true);
  });

  test('incrementFrame increments frameCount', () => {
    expect(state.frameCount).toBe(0);
    state.incrementFrame();
    expect(state.frameCount).toBe(1);
    state.incrementFrame();
    expect(state.frameCount).toBe(2);
  });

  test('reset clears all state', () => {
    state.addScore(500);
    state.addFruit({ isActive: true });
    state.setGameOver();
    state.incrementFrame();
    state.spawnPosition = { x: 100 };
    state.nextFruitLevel = 5;

    state.reset();

    expect(state.fruits).toEqual([]);
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
    expect(state.nextFruitLevel).toBe(1);
    expect(state.frameCount).toBe(0);
    expect(state.spawnPosition).toBeNull();
  });

  test('checkGameOver detects settled fruit above spawn line', () => {
    const spawnY = 100;
    const canvasHeight = 600;
    const oldTime = Date.now() - 3000;
    const fruit = {
      x: 200,
      y: 80,
      radius: 15,
      vy: 0.2,
      isActive: true,
      createdAt: oldTime,
    };
    state.addFruit(fruit);
    expect(state.checkGameOver(canvasHeight, spawnY)).toBe(true);
  });

  test('checkGameOver ignores freshly dropped fruit', () => {
    const spawnY = 100;
    const canvasHeight = 600;
    const fruit = {
      x: 200,
      y: 80,
      radius: 15,
      vy: 0.2,
      isActive: true,
      createdAt: Date.now(),
    };
    state.addFruit(fruit);
    expect(state.checkGameOver(canvasHeight, spawnY)).toBe(false);
  });

  test('checkGameOver ignores moving fruit', () => {
    const spawnY = 100;
    const canvasHeight = 600;
    const oldTime = Date.now() - 3000;
    const fruit = {
      x: 200,
      y: 80,
      radius: 15,
      vy: 5.0,
      isActive: true,
      createdAt: oldTime,
    };
    state.addFruit(fruit);
    expect(state.checkGameOver(canvasHeight, spawnY)).toBe(false);
  });
});
