# Architecture

## Module Dependency Diagram

```
index.html
  |
  +-- styles.css (UI styling)
  |
  +-- Game.js (orchestrator)
        |
        +-- Fruit.js        (data model)
        +-- Physics.js       (simulation)
        +-- CollisionDetector.js (detection + merge logic)
        +-- GameState.js     (state container)
        +-- InputHandler.js  (keyboard input)
```

`Game.js` is the central orchestrator that owns instances of all other modules.
Each module is self-contained with no cross-dependencies between them.

## Game Loop Flow

```
start()
  |
  v
gameLoop() <------ requestAnimationFrame
  |
  +-- update()
  |     |
  |     +-- Apply gravity to all active fruits
  |     +-- Apply horizontal friction to all active fruits
  |     +-- Update positions (x += vx, y += vy)
  |     +-- Handle boundary collisions (walls, floor)
  |     +-- Detect all collision pairs
  |     +-- For each pair:
  |     |     +-- Resolve collision impulse
  |     |     +-- Check if mergeable (same level) -> merge
  |     +-- Separation loop (5 iterations):
  |     |     +-- Re-detect collisions
  |     |     +-- Push overlapping pairs apart
  |     +-- Handle keyboard input (move spawn position)
  |     +-- Check game-over condition
  |     +-- Cleanup inactive fruits
  |     +-- Update score display
  |
  +-- draw()
  |     |
  |     +-- Clear canvas with background color
  |     +-- Draw game-over line (dashed red)
  |     +-- Draw next-fruit preview (semi-transparent)
  |     +-- Draw all active fruits
  |     +-- Draw game-over overlay (if applicable)
  |
  +-- incrementFrame()
  |
  +-- if isRunning -> schedule next gameLoop via requestAnimationFrame
```

## Physics Engine

### Gravity

Constant downward acceleration applied each frame using Euler integration:

```
fruit.vy += gravity   // default gravity = 0.5
```

This produces natural-looking free fall. Higher values make fruits fall faster.

### Friction

Friction is applied **only to horizontal velocity (vx)**, not vertical (vy).
This is a deliberate design decision: applying friction to vy would counteract
gravity and cause fruits to float in mid-air.

```
fruit.vx *= friction   // default friction = 0.75
if (|fruit.vx| < threshold) fruit.vx = 0
if (|fruit.vy| < threshold) fruit.vy = 0
```

The velocity threshold (0.1) prevents micro-vibration in stacked fruits by
zeroing out near-zero velocities.

### Collision Response

When two fruits collide (approaching each other), a vector-based impulse is applied:

1. Compute normalized collision normal: `n = (fruit2.pos - fruit1.pos) / distance`
2. Compute relative velocity along the normal
3. Only resolve if fruits are approaching (relative velocity > 0)
4. Apply damped impulse equally and oppositely to both fruits

```
impulse = relativeVelocity * damping   // damping = 0.75
fruit1.velocity -= impulse * normal
fruit2.velocity += impulse * normal
```

The damping coefficient (0.75) controls how much energy is lost per collision.
Lower values = more energy loss = fruits settle faster.

### Positional Separation

After collision response, fruits may still overlap. A separation pass runs
5 times per frame to push overlapping fruits apart:

```
overlap = minDistance - actualDistance
fruit1.position -= normal * overlap * 0.5
fruit2.position += normal * overlap * 0.5
```

The 50/50 split ensures equal displacement. Multiple iterations are needed
because separating one pair can push fruits into other fruits.

### Boundary Collisions

- **Left/Right walls**: Position clamped to wall, velocity reflected with damping
- **Floor**: Position clamped, velocity reflected with damping
- **Ceiling**: No bounce (fruits can go above the play area; this is required for game-over detection)

## Collision Detection Pipeline

```
1. findCollisions(activeFruits)
   |
   +-- For each unique pair (i, j):
   |     distance = sqrt(dx^2 + dy^2)
   |     if distance < radius_i + radius_j -> collision pair
   |
   v
2. For each collision pair:
   |
   +-- resolveCollision() -> apply impulse
   +-- canMerge()? -> same level + colliding + both active
         |
         yes -> mergeFruits()
         |       +-- Create new fruit at midpoint
         |       +-- New level = old level + 1 (max 11)
         |       +-- Velocity = average of both
         |       +-- Add score: 2^level * 10
         |       +-- Deactivate both source fruits
         |
         no -> continue
   |
   v
3. Separation pass (5 iterations):
   +-- Re-detect all collisions
   +-- separateFruits() for each overlapping pair
```

Time complexity: O(n^2) per frame for n active fruits. This is acceptable because
the maximum practical fruit count is around 20-30 in normal gameplay.

## Game State Management

`GameState` is a plain data container with no rendering or physics logic:

- `fruits[]` - all fruit objects (active and inactive)
- `score` - accumulated points
- `isGameOver` - terminal state flag
- `nextFruitLevel` - level of the next fruit to spawn (1-5, randomized)
- `frameCount` - total frames elapsed

### Game Over Detection

A fruit triggers game over when ALL three conditions are met:

1. **Above spawn line**: `fruit.y - fruit.radius < spawnY`
2. **Stable**: `|fruit.vy| < 1.0` (not still falling)
3. **Not fresh**: `now - fruit.createdAt > 2000ms` (at least 2 seconds old)

The "not fresh" check prevents false positives from newly spawned fruits that
haven't had time to fall yet.

## Performance Notes

- **Frame rate**: Targets 60fps via `requestAnimationFrame`
- **Collision detection**: O(n^2) brute force is sufficient for the expected fruit count (<30)
- **Separation iterations**: 5 passes per frame balances accuracy vs. CPU cost
- **No object pooling**: Fruits are created/GC'd as needed; with <30 objects this causes no measurable allocation pressure
- **Canvas rendering**: Simple circle drawing with `arc()` is GPU-accelerated in modern browsers
- **Memory**: No persistent allocations in the game loop; `getActiveFruits()` creates a filtered array each frame but this is negligible
- **Drop cooldown**: 500ms (30 frames at 60fps) prevents rapid fruit spawning that could overwhelm the physics engine
