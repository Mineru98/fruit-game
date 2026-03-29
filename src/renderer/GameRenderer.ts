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

  drawStartScreen(ctx: CanvasRenderingContext2D, time: number): void {
    const t = time / 1000;

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Twinkling stars
    for (let i = 0; i < 50; i++) {
      const px = (i * 137.508) % CANVAS_WIDTH;
      const py = (i * 97.345 + 23) % CANVAS_HEIGHT;
      const twinkle = Math.sin(t * (1.5 + (i % 5) * 0.3) + i * 1.7);
      if (twinkle > 0) {
        ctx.fillStyle = `rgba(255,255,255,${0.2 + twinkle * 0.5})`;
        ctx.fillRect(Math.floor(px), Math.floor(py), twinkle > 0.6 ? 2 : 1, twinkle > 0.6 ? 2 : 1);
      }
    }

    // Corner decorations
    const borderAlpha = 0.3 + Math.sin(t * 2) * 0.15;
    ctx.strokeStyle = `rgba(0,255,255,${borderAlpha})`;
    ctx.lineWidth = 2;
    const cs = 20;
    const m = 12;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(m, m + cs); ctx.lineTo(m, m); ctx.lineTo(m + cs, m);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH - m - cs, m); ctx.lineTo(CANVAS_WIDTH - m, m); ctx.lineTo(CANVAS_WIDTH - m, m + cs);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(m, CANVAS_HEIGHT - m - cs); ctx.lineTo(m, CANVAS_HEIGHT - m); ctx.lineTo(m + cs, CANVAS_HEIGHT - m);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH - m - cs, CANVAS_HEIGHT - m); ctx.lineTo(CANVAS_WIDTH - m, CANVAS_HEIGHT - m); ctx.lineTo(CANVAS_WIDTH - m, CANVAS_HEIGHT - m - cs);
    ctx.stroke();

    // Decorative border
    ctx.strokeStyle = `rgba(255,0,85,${borderAlpha * 0.5})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.strokeRect(m + 4, m + 4, CANVAS_WIDTH - (m + 4) * 2, CANVAS_HEIGHT - (m + 4) * 2);
    ctx.setLineDash([]);

    // Title "FRUIT GAME" with pulsing glow
    const glowIntensity = 18 + Math.sin(t * 3) * 12;
    ctx.shadowColor = '#FFE000';
    ctx.shadowBlur = glowIntensity;
    ctx.fillStyle = '#FFE000';
    ctx.font = "bold 32px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText('FRUIT', CANVAS_WIDTH / 2, 180);
    ctx.fillText('GAME', CANVAS_WIDTH / 2, 225);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // Subtitle
    ctx.fillStyle = '#00ffff';
    ctx.font = "8px 'Press Start 2P', monospace";
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 6;
    ctx.fillText('~ MERGE & SCORE ~', CANVAS_WIDTH / 2, 260);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // Sample fruits floating
    const fruitLevels = [1, 2, 3, 4, 5];
    const spacing = 64;
    const startX = CANVAS_WIDTH / 2 - (fruitLevels.length - 1) * spacing / 2;
    const baseY = 340;

    for (let i = 0; i < fruitLevels.length; i++) {
      const level = fruitLevels[i];
      const neon = NEON_COLORS[level];
      const x = startX + i * spacing;
      const y = baseY + Math.sin(t * 2 + i * 1.3) * 12;
      const displayRadius = 14 + i * 3;

      ctx.shadowColor = neon;
      ctx.shadowBlur = 14;

      try {
        const fruitCanvas = this.fruitRenderer.getCanvasForLevel(level);
        if (fruitCanvas.width > 0) {
          ctx.drawImage(fruitCanvas, x - displayRadius, y - displayRadius, displayRadius * 2, displayRadius * 2);
        } else {
          this.drawCircle(ctx, x, y, displayRadius, neon);
        }
      } catch {
        this.drawCircle(ctx, x, y, displayRadius, neon);
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      // Glow ring
      ctx.strokeStyle = neon;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, displayRadius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Merge arrows between fruits
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < fruitLevels.length - 1; i++) {
      const r1 = 14 + i * 3;
      const r2 = 14 + (i + 1) * 3;
      const x1 = startX + i * spacing + r1 + 6;
      const x2 = startX + (i + 1) * spacing - r2 - 6;
      const y1 = baseY + Math.sin(t * 2 + i * 1.3) * 12;
      const y2 = baseY + Math.sin(t * 2 + (i + 1) * 1.3) * 12;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      // Arrowhead
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.moveTo(x2 + 1, y2);
      ctx.lineTo(x2 - 4, y2 - 3);
      ctx.lineTo(x2 - 4, y2 + 3);
      ctx.fill();
    }

    // "PRESS START" blinking
    const blink = Math.floor(t * 1.5) % 2 === 0;
    if (blink) {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      ctx.fillStyle = '#ff00ff';
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 16;
      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.fillText(
        isTouchDevice ? 'TAP TO START' : 'PRESS START',
        CANVAS_WIDTH / 2,
        460,
      );
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }

    // Controls hint
    ctx.fillStyle = '#333';
    ctx.font = "6px 'Press Start 2P', monospace";
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    ctx.fillText(
      isTouchDevice ? 'TOUCH TO AIM & DROP' : 'ARROW KEYS + SPACE',
      CANVAS_WIDTH / 2,
      510,
    );

    // Scanline overlay
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let y = 0; y < CANVAS_HEIGHT; y += 3) {
      ctx.fillRect(0, y, CANVAS_WIDTH, 1);
    }
  }

  drawCountdown(ctx: CanvasRenderingContext2D, elapsed: number): void {
    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let text: string;
    let color: string;
    let localT: number;

    if (elapsed < 500) {
      text = '3';
      color = '#00ffff';
      localT = elapsed / 500;
    } else if (elapsed < 1000) {
      text = '2';
      color = '#ff00ff';
      localT = (elapsed - 500) / 500;
    } else if (elapsed < 1500) {
      text = '1';
      color = '#FFE000';
      localT = (elapsed - 1000) / 500;
    } else {
      text = 'GO!';
      color = '#00ff88';
      localT = Math.min(1, (elapsed - 1500) / 500);
    }

    // Scale: starts large, settles to 1
    const scale = 1 + (1 - Math.min(1, localT * 3)) * 0.8;
    // Quick fade in
    const alpha = Math.min(1, localT * 5);

    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = 25;
    ctx.fillStyle = color;
    ctx.font = text === 'GO!' ? "bold 48px 'Press Start 2P', monospace" : "bold 64px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);

    // Double glow
    ctx.shadowBlur = 40;
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillText(text, 0, 0);

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.globalAlpha = 1;
    ctx.restore();

    // Horizontal flash lines on each step
    if (localT < 0.15) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 1 - localT / 0.15;
      ctx.fillRect(0, CANVAS_HEIGHT / 2 - 22, CANVAS_WIDTH, 2);
      ctx.fillRect(0, CANVAS_HEIGHT / 2 + 18, CANVAS_WIDTH, 2);
      ctx.globalAlpha = 1;
    }
  }

  private drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
