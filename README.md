# Fruit Game

A physics-based casual game built with web technologies.
Implements the physics engine, collision detection, and game mechanics from the Excel VBA watermelon game using Canvas and JavaScript.

## How to Play

- **Arrow Keys (Left/Right)**: Move the fruit drop position
- **Spacebar**: Drop the fruit
- **Goal**: Merge matching fruits to create higher-level fruits and score points

### Game Rules

1. Fruits drop from the top of the play area
2. When two fruits of the same level collide, they merge into one larger fruit (next level)
3. There are 11 fruit levels, from the smallest (level 1) to the watermelon (level 11)
4. The game ends when a settled fruit reaches above the spawn line
5. Spawn level is randomized between 1 and 5

## Tech Stack

- **Rendering**: HTML5 Canvas 2D
- **Physics**: Custom 2D physics engine (gravity, friction, vector-based collision response)
- **Language**: JavaScript ES6+
- **Testing**: Jest + Babel
- **Styling**: CSS3 with responsive layout

## Installation & Running

```bash
# Install dependencies
npm install

# Run all tests (51 unit tests)
npm test

# Start the game server (port 8080)
npm start

# Then open in browser:
# http://localhost:8080/src/index.html
```

## Project Structure

```
src/
  index.html           - Game main page
  styles.css           - UI styles
  Game.js              - Main game loop and orchestration
  Fruit.js             - Fruit object class (11 levels, colors, radii)
  Physics.js           - Physics engine (gravity, friction, collision response)
  CollisionDetector.js - Collision detection and merge logic
  GameState.js         - Game state management (score, fruits, game over)
  InputHandler.js      - Keyboard input handling

tests/
  Fruit.test.js           - 11 tests
  Physics.test.js         - 10 tests
  CollisionDetector.test.js - 8 tests
  GameState.test.js       - 10 tests
  Game.test.js            - 12 tests
```

## Game Mechanics

### Physics Engine

| Parameter | Default | Description |
|-----------|---------|-------------|
| gravity | 0.5 | Gravitational acceleration (pixels/frame^2) |
| friction | 0.75 | Horizontal (X-axis) friction coefficient |
| damping | 0.75 | Collision energy loss coefficient |
| velocityThreshold | 0.1 | Minimum velocity before zeroing |

- **Gravity**: Euler integration (`vy += gravity` each frame)
- **Friction**: Applied only to horizontal velocity (vx) to prevent counteracting gravity on vertical axis
- **Collision Response**: Vector-based impulse with damping coefficient
- **Overlap Prevention**: 5 iterations of positional separation per frame
- **Boundary**: Wall and floor bounce with energy loss; no ceiling bounce (needed for game-over detection)

### Collision Detection

- Euclidean distance formula for circle-circle collision (`distance < r1 + r2`)
- Same-level fruits merge at midpoint position with averaged velocity
- Maximum level is 11 (watermelon); no merge beyond that

### Scoring

Score for merging to level N: `2^N * 10` points

## License

MIT
