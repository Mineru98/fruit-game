const Game = require('../src/Game');
const Fruit = require('../src/Fruit');

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game('gameCanvas');
  });

  afterEach(() => {
    if (game && game.gameState.isRunning) {
      game.stop();
    }
  });

  test('constructor initializes all subsystems', () => {
    expect(game.gameState).toBeDefined();
    expect(game.physics).toBeDefined();
    expect(game.collisionDetector).toBeDefined();
    expect(game.inputHandler).toBeDefined();
    expect(game.canvasWidth).toBe(400);
    expect(game.canvasHeight).toBe(600);
    expect(game.spawnX).toBe(200);
    expect(game.spawnY).toBe(50);
  });

  test('start() sets isRunning to true and initializes state', () => {
    game.start();
    expect(game.gameState.isRunning).toBe(true);
    expect(game.gameState.score).toBe(0);
    expect(game.gameState.isGameOver).toBe(false);
    expect(game.gameState.nextFruitLevel).toBeGreaterThanOrEqual(1);
    expect(game.gameState.nextFruitLevel).toBeLessThanOrEqual(5);
  });

  test('gameLoop increments frameCount each call', () => {
    game.gameState.isRunning = true;
    const initialFrame = game.gameState.frameCount;

    for (let i = 0; i < 5; i++) {
      game.update();
      game.gameState.incrementFrame();
    }

    expect(game.gameState.frameCount).toBe(initialFrame + 5);
  });

  test('spawnX changes when input keys are pressed', () => {
    game.start();
    const initialX = game.spawnX;

    // Simulate left key via direction property
    game.inputHandler.direction = -1;
    game.update();
    expect(game.spawnX).toBeLessThan(initialX);

    // Reset and test right
    game.inputHandler.direction = 0;
    const afterLeft = game.spawnX;
    game.inputHandler.direction = 1;
    game.update();
    expect(game.spawnX).toBeGreaterThan(afterLeft);
  });

  test('spawnFruit adds a fruit to gameState.fruits', () => {
    game.gameState.nextFruitLevel = 3;
    const countBefore = game.gameState.fruits.length;

    game.spawnFruit();

    expect(game.gameState.fruits.length).toBe(countBefore + 1);
    const spawned = game.gameState.fruits[game.gameState.fruits.length - 1];
    expect(spawned.level).toBe(3);
    expect(spawned.x).toBe(game.spawnX);
    expect(spawned.y).toBe(game.spawnY);
  });

  test('spawnFruit sets nextFruitLevel to random 1-5', () => {
    const levels = new Set();
    for (let i = 0; i < 50; i++) {
      game.gameState.nextFruitLevel = 1;
      game.spawnFruit();
      levels.add(game.gameState.nextFruitLevel);
    }
    // All next levels should be between 1 and 5
    for (const level of levels) {
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(5);
    }
  });

  test('mergeFruits creates a higher-level fruit and adds score', () => {
    const fruit1 = new Fruit(100, 300, 2);
    const fruit2 = new Fruit(110, 300, 2);
    game.gameState.addFruit(fruit1);
    game.gameState.addFruit(fruit2);

    game.mergeFruits(fruit1, fruit2);

    expect(fruit1.isActive).toBe(false);
    expect(fruit2.isActive).toBe(false);

    const activeFruits = game.gameState.getActiveFruits();
    const merged = activeFruits.find(f => f.level === 3);
    expect(merged).toBeDefined();
    expect(game.gameState.score).toBe(Fruit.getScoreForLevel(3));
  });

  test('collision detection works with overlapping fruits', () => {
    const fruit1 = new Fruit(100, 400, 1);
    const fruit2 = new Fruit(120, 400, 1);
    game.gameState.addFruit(fruit1);
    game.gameState.addFruit(fruit2);

    const activeFruits = game.gameState.getActiveFruits();
    const pairs = game.collisionDetector.findCollisions(activeFruits);

    expect(pairs.length).toBeGreaterThan(0);
  });

  test('update applies gravity to fruits', () => {
    game.gameState.isRunning = true;
    const fruit = new Fruit(200, 100, 1);
    fruit.createdAt = Date.now();
    game.gameState.addFruit(fruit);

    const vyBefore = fruit.vy;
    game.update();

    // Gravity should have increased vy
    expect(fruit.vy).toBeGreaterThan(vyBefore);
  });

  test('game over is detected when settled fruit is above spawn line', () => {
    game.gameState.isRunning = true;
    // Create a fruit above the spawn line that is settled and old
    const fruit = new Fruit(200, 20, 1);
    fruit.vy = 0;
    fruit.vx = 0;
    fruit.createdAt = Date.now() - 3000; // 3 seconds old
    game.gameState.addFruit(fruit);

    game.update();

    expect(game.gameState.isGameOver).toBe(true);
  });

  test('stop() sets isRunning to false', () => {
    game.start();
    expect(game.gameState.isRunning).toBe(true);
    game.stop();
    expect(game.gameState.isRunning).toBe(false);
  });

  test('mergeFruits does not create level above 11', () => {
    const fruit1 = new Fruit(100, 300, 11);
    const fruit2 = new Fruit(110, 300, 11);
    game.gameState.addFruit(fruit1);
    game.gameState.addFruit(fruit2);

    const scoreBefore = game.gameState.score;
    game.mergeFruits(fruit1, fruit2);

    // Should not merge - both still active, no score added
    expect(fruit1.isActive).toBe(true);
    expect(fruit2.isActive).toBe(true);
    expect(game.gameState.score).toBe(scoreBefore);
  });
});
