import { Fruit } from '../engine/Fruit';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SPAWN_Y, NEON_COLORS } from '../constants';
import { FruitRenderer } from './FruitRenderer';

export class GameRenderer {
  private fruitRenderer = new FruitRenderer();

  drawBackground(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(255,0,85,0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, SPAWN_Y);
    ctx.lineTo(CANVAS_WIDTH, SPAWN_Y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
  }

  drawPreview(ctx: CanvasRenderingContext2D, level: number, x: number, isDelayed: boolean): void {
    const radius = Fruit.getRadius(level);
    const neon = NEON_COLORS[level] || '#00ffff';
    ctx.globalAlpha = isDelayed ? 0.3 : 0.7;

    try {
      const canvas = this.fruitRenderer.getCanvasForLevel(level);
      if (canvas.width > 0) {
        ctx.drawImage(canvas, x - radius, SPAWN_Y - radius, radius * 2, radius * 2);
      } else {
        this.drawCircle(ctx, x, SPAWN_Y, radius, neon);
      }
    } catch {
      this.drawCircle(ctx, x, SPAWN_Y, radius, neon);
    }

    ctx.globalAlpha = isDelayed ? 0.3 : 0.7;
    ctx.strokeStyle = neon;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, SPAWN_Y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  drawFruits(ctx: CanvasRenderingContext2D, fruits: Fruit[]): void {
    for (const fruit of fruits) {
      const neon = NEON_COLORS[fruit.level] || '#00ffff';
      ctx.shadowColor = neon;
      ctx.shadowBlur = 8;

      try {
        const canvas = this.fruitRenderer.getCanvasForLevel(fruit.level);
        if (canvas.width > 0) {
          ctx.drawImage(canvas, fruit.x - fruit.radius, fruit.y - fruit.radius, fruit.radius * 2, fruit.radius * 2);
        } else {
          this.drawCircle(ctx, fruit.x, fruit.y, fruit.radius, neon);
        }
      } catch {
        this.drawCircle(ctx, fruit.x, fruit.y, fruit.radius, neon);
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = neon;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  drawGameOver(ctx: CanvasRenderingContext2D, score: number): void {
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.shadowColor = '#FFE000';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#FFE000';
    ctx.font = "bold 28px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.font = "12px 'Press Start 2P', monospace";
    ctx.fillText(
      `SCORE  ${String(score).padStart(5, '0')}`,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 10,
    );

    const showBlink = Math.floor(Date.now() / 500) % 2 === 0;
    if (showBlink) {
      ctx.fillStyle = '#ff00ff';
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.font = "8px 'Press Start 2P', monospace";
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      ctx.fillText(
        isTouchDevice ? 'TAP TO START' : 'PRESS SPACE',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 50,
      );
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }
  }

  private drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
