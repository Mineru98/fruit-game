import React, { useEffect, useRef, useState } from 'react';
import { Fruit } from '../engine/Fruit';
import { GameState } from '../engine/GameState';
import { InputHandler } from '../engine/InputHandler';
import { CannonPhysics } from '../engine/CannonPhysics';
import { CollisionHandler } from '../engine/CollisionHandler';
import { FruitSVG } from '../engine/FruitSVG';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const SPAWN_Y = 50;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>(new GameState());
  const physicsRef = useRef<CannonPhysics | null>(null);
  const collisionHandlerRef = useRef<CollisionHandler>(new CollisionHandler());
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const fruitSVGRef = useRef<FruitSVG>(new FruitSVG());
  const spawnXRef = useRef(CANVAS_WIDTH / 2);
  const nextFruitDelayRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [nextLevel, setNextLevel] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;
    const physics = new CannonPhysics(CANVAS_WIDTH, CANVAS_HEIGHT);
    physicsRef.current = physics;
    const collisionHandler = collisionHandlerRef.current;
    const inputHandler = new InputHandler();
    inputHandlerRef.current = inputHandler;

    gameState.reset();
    gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;

    const gameLoop = () => {
      if (!physicsRef.current || !gameState) return;

      // Input
      const dir = inputHandler.getDirection();
      if (dir === -1) {
        spawnXRef.current = Math.max(20, spawnXRef.current - 5);
      } else if (dir === 1) {
        spawnXRef.current = Math.min(CANVAS_WIDTH - 20, spawnXRef.current + 5);
      }

      // Spawn
      if (inputHandler.isFiring() && !gameState.isGameOver) {
        if (!nextFruitDelayRef.current) {
          const fruit = new Fruit(
            `fruit-${Date.now()}`,
            gameState.nextFruitLevel,
            spawnXRef.current,
            SPAWN_Y
          );
          gameState.addFruit(fruit);
          physics.addFruit(fruit);
          gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;
          nextFruitDelayRef.current = true;
          setTimeout(() => {
            nextFruitDelayRef.current = false;
          }, 500);
        }
      }

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
          }
        } else {
          collisionHandler.handleCollision(f1, f2);
        }
      }

      // Game over check
      if (!gameState.isGameOver && gameState.checkGameOver(CANVAS_HEIGHT, SPAWN_Y)) {
        gameState.setGameOver();
      }

      gameState.cleanup();

      // Update React state
      setFruits([...gameState.fruits]);
      setScore(gameState.score);
      setGameOver(gameState.isGameOver);
      setNextLevel(gameState.nextFruitLevel);

      // Render
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = 'rgba(255,0,0,0.3)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, SPAWN_Y);
      ctx.lineTo(CANVAS_WIDTH, SPAWN_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw next fruit preview
      if (!gameState.isGameOver && !nextFruitDelayRef.current) {
        const previewLevel = gameState.nextFruitLevel;
        const previewRadius = Fruit.getRadius(previewLevel);
        const previewX = spawnXRef.current;
        ctx.globalAlpha = 0.7;
        try {
          const previewCanvas = fruitSVGRef.current.getCanvasForLevel(previewLevel);
          if (previewCanvas.width > 0) {
            ctx.drawImage(previewCanvas, previewX - previewRadius, SPAWN_Y - previewRadius, previewRadius * 2, previewRadius * 2);
          } else {
            ctx.fillStyle = Fruit.COLORS[previewLevel];
            ctx.beginPath();
            ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch {
          ctx.fillStyle = Fruit.COLORS[previewLevel];
          ctx.beginPath();
          ctx.arc(previewX, SPAWN_Y, previewRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Draw fruits
      for (const fruit of gameState.fruits) {
        try {
          const fruitCanvas = fruitSVGRef.current.getCanvasForLevel(fruit.level);
          if (fruitCanvas.width > 0) {
            ctx.drawImage(fruitCanvas, fruit.x - fruit.radius, fruit.y - fruit.radius, fruit.radius * 2, fruit.radius * 2);
          } else {
            // Fallback to circle if SVG not loaded yet
            ctx.fillStyle = Fruit.COLORS[fruit.level];
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch {
          // Fallback to simple circle
          ctx.fillStyle = Fruit.COLORS[fruit.level];
          ctx.beginPath();
          ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw game over overlay
      if (gameState.isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('게임 오버', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

        ctx.font = '24px Arial';
        ctx.fillText(`점수: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

        ctx.font = '16px Arial';
        ctx.fillText('Space 키로 재시작', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
      }

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      inputHandler.destroy();
    };
  }, []);

  const handleRestart = () => {
    const gameState = gameStateRef.current;
    const physics = physicsRef.current;

    if (gameState && physics) {
      gameState.reset();
      physics.reset();
      gameState.nextFruitLevel = Math.floor(Math.random() * 5) + 1;
      spawnXRef.current = CANVAS_WIDTH / 2;
      nextFruitDelayRef.current = false;

      setFruits([]);
      setScore(0);
      setGameOver(false);
      setNextLevel(gameState.nextFruitLevel);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">🍎 과일 게임</h1>
        <GameCanvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-800 rounded shadow-lg"
        />
        <GameUI
          score={score}
          gameOver={gameOver}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
