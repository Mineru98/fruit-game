import { useEffect, useRef, useState } from 'react';
import { Fruit } from '../engine/Fruit';
import { GameState } from '../engine/GameState';
import { InputHandler } from '../engine/InputHandler';
import { CannonPhysics } from '../engine/CannonPhysics';
import { CollisionHandler } from '../engine/CollisionHandler';
import { SoundEngine } from '../engine/SoundEngine';
import { GameRenderer } from '../renderer/GameRenderer';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SPAWN_Y } from '../constants';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>(new GameState());
  const physicsRef = useRef<CannonPhysics | null>(null);
  const collisionHandlerRef = useRef<CollisionHandler>(new CollisionHandler());
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const rendererRef = useRef<GameRenderer>(new GameRenderer());
  const soundRef = useRef<SoundEngine>(new SoundEngine());
  const spawnXRef = useRef(CANVAS_WIDTH / 2);
  const nextFruitDelayRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);
  const touchFireRef = useRef(false);
  const handleRestartRef = useRef<() => void>(() => {});

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const handleRestart = () => {
    const gameState = gameStateRef.current;
    const physics = physicsRef.current;

    if (gameState && physics) {
      gameState.reset();
      physics.reset();
      gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;
      spawnXRef.current = CANVAS_WIDTH / 2;
      nextFruitDelayRef.current = false;
      touchFireRef.current = false;
      setScore(0);
      setGameOver(false);
    }
  };

  const handleSoundToggle = () => {
    const on = soundRef.current.toggle();
    setSoundOn(on);
  };

  // Keep ref in sync so touch handler always calls latest version
  handleRestartRef.current = handleRestart;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const gameState = gameStateRef.current;
    const physics = new CannonPhysics(CANVAS_WIDTH, CANVAS_HEIGHT);
    physicsRef.current = physics;
    const collisionHandler = collisionHandlerRef.current;
    const inputHandler = new InputHandler();
    inputHandlerRef.current = inputHandler;
    const renderer = rendererRef.current;
    const sound = soundRef.current;

    gameState.reset();
    gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;

    // Map clientX to canvas coordinate space (handles CSS scaling)
    const getCanvasX = (clientX: number): number => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      return Math.max(20, Math.min(CANVAS_WIDTH - 20, (clientX - rect.left) * scaleX));
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      spawnXRef.current = getCanvasX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      spawnXRef.current = getCanvasX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (gameStateRef.current.isGameOver) {
        handleRestartRef.current();
      } else {
        touchFireRef.current = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      spawnXRef.current = getCanvasX(e.clientX);
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      if (gameStateRef.current.isGameOver) {
        handleRestartRef.current();
      } else {
        touchFireRef.current = true;
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    const gameLoop = () => {
      if (!physicsRef.current || !gameState) return;

      // Keyboard input
      const dir = inputHandler.getDirection();
      if (dir === -1) {
        spawnXRef.current = Math.max(20, spawnXRef.current - 12);
      } else if (dir === 1) {
        spawnXRef.current = Math.min(CANVAS_WIDTH - 20, spawnXRef.current + 12);
      }

      // Spawn (keyboard Space or touch tap)
      const shouldFire = inputHandler.isFiring() || touchFireRef.current;
      if (shouldFire && !gameState.isGameOver) {
        if (!nextFruitDelayRef.current) {
          const fruit = new Fruit(
            `fruit-${Date.now()}`,
            gameState.nextFruitLevel,
            spawnXRef.current,
            SPAWN_Y
          );
          gameState.addFruit(fruit);
          physics.addFruit(fruit);
          sound.drop();
          gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;
          nextFruitDelayRef.current = true;
          setTimeout(() => {
            nextFruitDelayRef.current = false;
          }, 500);
        }
      }
      // Reset touch fire after each frame check
      if (touchFireRef.current) touchFireRef.current = false;

      // Physics
      const activeFruits = gameState.getActiveFruits();
      physics.step(activeFruits);

      // Collision detection
      const collisions = collisionHandler.findCollisions(activeFruits);
      for (const [f1, f2] of collisions) {
        if (!f1.isActive || !f2.isActive) continue;

        if (collisionHandler.canMerge(f1, f2)) {
          const newFruit = collisionHandler.mergeFruits(f1, f2, gameState);
          if (newFruit) {
            physics.addFruit(newFruit);
            sound.merge(newFruit.level);
          }
          physics.removeFruit(f1);
          physics.removeFruit(f2);
        }
      }

      // Game over check
      if (!gameState.isGameOver && gameState.checkGameOver(CANVAS_HEIGHT, SPAWN_Y)) {
        gameState.setGameOver();
        sound.gameOver();
      }

      gameState.cleanup();

      // Update React state
      setScore(gameState.score);
      setGameOver(gameState.isGameOver);

      // Render
      renderer.drawBackground(ctx);

      if (!gameState.isGameOver) {
        renderer.drawPreview(ctx, gameState.nextFruitLevel, spawnXRef.current, nextFruitDelayRef.current);
      }

      renderer.drawFruits(ctx, gameState.fruits);

      if (gameState.isGameOver) {
        renderer.drawGameOver(ctx, gameState.score);
      }

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      inputHandler.destroy();
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden" style={{ background: '#0a0a1a' }}>
      <div className="text-center w-full px-2">
        <GameCanvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
        <GameUI
          score={score}
          gameOver={gameOver}
          onRestart={handleRestart}
          soundOn={soundOn}
          onSoundToggle={handleSoundToggle}
        />
      </div>
    </div>
  );
}
