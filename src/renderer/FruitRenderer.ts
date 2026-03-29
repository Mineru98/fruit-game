type Rect = [number, number, number, number, string]; // [x, y, w, h, fill]

interface FruitDef {
  viewSize: number;
  rects: Rect[];
}

const FRUIT_DEFS: Record<number, FruitDef> = {
  1: { viewSize: 12, rects: [
    [4,0,1,3,'#3d2000'], [7,0,1,3,'#3d2000'], [3,1,4,1,'#3d2000'],
    [2,4,1,4,'#ff0055'], [3,3,2,6,'#ff0055'], [5,4,1,4,'#ff0055'],
    [6,4,1,4,'#cc0044'], [7,3,2,6,'#cc0044'], [9,4,1,4,'#cc0044'],
    [3,4,1,1,'#ff6688'], [7,4,1,1,'#ff6688'],
  ]},
  2: { viewSize: 12, rects: [
    [4,0,1,2,'#00aa33'], [3,1,3,2,'#00aa33'],
    [2,1,2,1,'#00cc44'], [7,1,2,1,'#00cc44'],
    [2,2,8,1,'#ff0055'], [1,3,10,4,'#ff0055'],
    [2,7,8,1,'#ff0055'], [3,8,6,1,'#ff0055'],
    [4,9,4,1,'#ff0055'], [5,10,2,1,'#ff0055'],
    [3,4,1,1,'#ffdd00'], [6,3,1,1,'#ffdd00'], [9,5,1,1,'#ffdd00'],
    [4,6,1,1,'#ffdd00'], [7,6,1,1,'#ffdd00'],
    [2,3,1,1,'#ff4477'],
  ]},
  3: { viewSize: 12, rects: [
    [5,0,2,2,'#00aa33'],
    [2,2,3,3,'#cc00ff'], [7,2,3,3,'#aa00dd'],
    [1,5,3,3,'#aa00dd'], [4,5,4,3,'#cc00ff'], [8,5,3,3,'#9900bb'],
    [3,8,3,3,'#9900bb'], [6,8,3,3,'#cc00ff'],
    [2,2,1,1,'#ee44ff'], [7,2,1,1,'#ee44ff'], [4,5,1,1,'#ee44ff'],
  ]},
  4: { viewSize: 12, rects: [
    [4,0,4,2,'#ff9900'], [5,0,1,1,'#00aa33'],
    [1,2,10,1,'#ff9900'], [0,3,12,6,'#ff9900'],
    [1,9,10,1,'#ff9900'], [2,10,8,1,'#ff9900'], [4,11,4,1,'#ff9900'],
    [1,3,2,2,'#ffbb33'], [2,5,4,1,'#ffaa00'], [7,4,2,2,'#ffbb33'],
  ]},
  5: { viewSize: 12, rects: [
    [4,0,4,1,'#006600'], [3,1,2,2,'#008800'], [7,1,2,2,'#006600'], [5,1,2,1,'#00aa00'],
    [1,2,10,1,'#ff8800'], [0,3,12,6,'#ff8800'],
    [1,9,10,1,'#ff8800'], [2,10,8,1,'#ff8800'], [4,11,4,1,'#ff8800'],
    [0,6,12,1,'#ee7700'], [1,3,2,2,'#ffaa44'],
  ]},
  6: { viewSize: 12, rects: [
    [5,0,2,2,'#3d2000'], [7,1,3,2,'#00aa33'],
    [1,2,10,1,'#ee1111'],
    [0,3,5,7,'#ee1111'], [7,3,5,7,'#ee1111'], [5,3,2,9,'#cc1100'],
    [1,10,4,1,'#ee1111'], [7,10,4,1,'#ee1111'], [2,11,8,1,'#ee1111'],
    [1,3,2,3,'#ff4444'],
  ]},
  7: { viewSize: 12, rects: [
    [5,0,2,2,'#3d2000'],
    [3,2,6,2,'#aacc00'],
    [2,4,8,4,'#ccdd22'], [1,5,10,4,'#ccdd22'],
    [2,9,8,1,'#ccdd22'], [3,10,6,1,'#aacc00'], [4,11,4,1,'#88aa00'],
    [2,3,2,2,'#ddee44'], [5,5,1,1,'#bbcc11'],
  ]},
  8: { viewSize: 12, rects: [
    [4,0,1,2,'#00aa33'],
    [1,2,10,1,'#ffaaaa'], [0,3,12,6,'#ffaaaa'],
    [1,9,10,1,'#ffaaaa'], [2,10,8,1,'#ff8888'], [4,11,4,1,'#ff6666'],
    [5,1,2,11,'#ff8899'], [1,3,2,3,'#ffcccc'],
  ]},
  9: { viewSize: 12, rects: [
    [2,0,2,3,'#00aa33'], [5,0,2,4,'#00cc44'], [8,0,2,3,'#00aa33'],
    [1,3,10,7,'#ffdd00'], [2,10,8,1,'#ffdd00'], [3,11,6,1,'#eebb00'],
    [1,5,10,1,'#ccaa00'], [1,7,10,1,'#ccaa00'],
    [3,3,1,8,'#ccaa00'], [6,3,1,8,'#ccaa00'], [9,3,1,8,'#ccaa00'],
  ]},
  10: { viewSize: 12, rects: [
    [5,0,2,1,'#3d2000'],
    [1,1,10,2,'#99cc66'], [0,3,12,6,'#99cc66'],
    [1,9,10,2,'#99cc66'], [3,11,6,1,'#77aa44'],
    [0,4,12,1,'#bbee88'], [0,7,12,1,'#bbee88'],
    [2,1,1,10,'#bbee88'], [5,1,1,10,'#aabb77'], [9,1,1,10,'#bbee88'],
    [1,2,2,2,'#ccee99'],
  ]},
  11: { viewSize: 16, rects: [
    [4,0,8,1,'#005500'], [2,1,12,2,'#007700'],
    [1,3,14,10,'#009900'],
    [2,13,12,2,'#007700'], [4,15,8,1,'#005500'],
    [2,4,12,8,'#ff1155'],
    [1,5,1,6,'#ff1155'], [14,5,1,6,'#ff1155'],
    [3,1,2,3,'#00bb00'], [7,1,2,3,'#00aa00'], [11,1,2,3,'#00bb00'],
    [4,7,2,2,'#111111'], [8,6,2,2,'#111111'], [11,9,2,2,'#111111'],
    [2,4,2,2,'#ff4477'],
  ]},
};

export class FruitSVG {
  private cache: Map<number, HTMLCanvasElement> = new Map();
  private readonly canvasSize = 80;

  getCanvasForLevel(level: number): HTMLCanvasElement {
    if (this.cache.has(level)) {
      return this.cache.get(level)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.imageSmoothingEnabled = false;

    const def = FRUIT_DEFS[level] ?? FRUIT_DEFS[1];
    const scale = this.canvasSize / def.viewSize;

    for (const [x, y, w, h, fill] of def.rects) {
      ctx.fillStyle = fill;
      ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
    }

    this.cache.set(level, canvas);
    return canvas;
  }
}
