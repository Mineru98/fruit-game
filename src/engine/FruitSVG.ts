export class FruitSVG {
  private cache: Map<number, HTMLCanvasElement> = new Map();
  private readonly size = 80;

  getSVGForLevel(level: number): string {
    const fruits: Record<number, string> = {
      1: this.cherrySVG(),
      2: this.strawberrySVG(),
      3: this.grapeSVG(),
      4: this.dekoponfSVG(),
      5: this.kakiSVG(),
      6: this.appleSVG(),
      7: this.pearSVG(),
      8: this.peachSVG(),
      9: this.pineappleSVG(),
      10: this.melonSVG(),
      11: this.watermelonSVG(),
    };
    return fruits[level] || fruits[1];
  }

  private cherrySVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="1" height="3" fill="#3d2000"/>
      <rect x="7" y="0" width="1" height="3" fill="#3d2000"/>
      <rect x="3" y="1" width="4" height="1" fill="#3d2000"/>
      <rect x="2" y="4" width="1" height="4" fill="#ff0055"/>
      <rect x="3" y="3" width="2" height="6" fill="#ff0055"/>
      <rect x="5" y="4" width="1" height="4" fill="#ff0055"/>
      <rect x="6" y="4" width="1" height="4" fill="#cc0044"/>
      <rect x="7" y="3" width="2" height="6" fill="#cc0044"/>
      <rect x="9" y="4" width="1" height="4" fill="#cc0044"/>
      <rect x="3" y="4" width="1" height="1" fill="#ff6688"/>
      <rect x="7" y="4" width="1" height="1" fill="#ff6688"/>
    </svg>`;
  }

  private strawberrySVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="1" height="2" fill="#00aa33"/>
      <rect x="3" y="1" width="3" height="2" fill="#00aa33"/>
      <rect x="2" y="1" width="2" height="1" fill="#00cc44"/>
      <rect x="7" y="1" width="2" height="1" fill="#00cc44"/>
      <rect x="2" y="2" width="8" height="1" fill="#ff0055"/>
      <rect x="1" y="3" width="10" height="4" fill="#ff0055"/>
      <rect x="2" y="7" width="8" height="1" fill="#ff0055"/>
      <rect x="3" y="8" width="6" height="1" fill="#ff0055"/>
      <rect x="4" y="9" width="4" height="1" fill="#ff0055"/>
      <rect x="5" y="10" width="2" height="1" fill="#ff0055"/>
      <rect x="3" y="4" width="1" height="1" fill="#ffdd00"/>
      <rect x="6" y="3" width="1" height="1" fill="#ffdd00"/>
      <rect x="9" y="5" width="1" height="1" fill="#ffdd00"/>
      <rect x="4" y="6" width="1" height="1" fill="#ffdd00"/>
      <rect x="7" y="6" width="1" height="1" fill="#ffdd00"/>
      <rect x="2" y="3" width="1" height="1" fill="#ff4477"/>
    </svg>`;
  }

  private grapeSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="2" fill="#00aa33"/>
      <rect x="2" y="2" width="3" height="3" fill="#cc00ff"/>
      <rect x="7" y="2" width="3" height="3" fill="#aa00dd"/>
      <rect x="1" y="5" width="3" height="3" fill="#aa00dd"/>
      <rect x="4" y="5" width="4" height="3" fill="#cc00ff"/>
      <rect x="8" y="5" width="3" height="3" fill="#9900bb"/>
      <rect x="3" y="8" width="3" height="3" fill="#9900bb"/>
      <rect x="6" y="8" width="3" height="3" fill="#cc00ff"/>
      <rect x="2" y="2" width="1" height="1" fill="#ee44ff"/>
      <rect x="7" y="2" width="1" height="1" fill="#ee44ff"/>
      <rect x="4" y="5" width="1" height="1" fill="#ee44ff"/>
    </svg>`;
  }

  private dekoponfSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="4" height="2" fill="#ff9900"/>
      <rect x="5" y="0" width="1" height="1" fill="#00aa33"/>
      <rect x="1" y="2" width="10" height="1" fill="#ff9900"/>
      <rect x="0" y="3" width="12" height="6" fill="#ff9900"/>
      <rect x="1" y="9" width="10" height="1" fill="#ff9900"/>
      <rect x="2" y="10" width="8" height="1" fill="#ff9900"/>
      <rect x="4" y="11" width="4" height="1" fill="#ff9900"/>
      <rect x="1" y="3" width="2" height="2" fill="#ffbb33"/>
      <rect x="2" y="5" width="4" height="1" fill="#ffaa00"/>
      <rect x="7" y="4" width="2" height="2" fill="#ffbb33"/>
    </svg>`;
  }

  private kakiSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="4" height="1" fill="#006600"/>
      <rect x="3" y="1" width="2" height="2" fill="#008800"/>
      <rect x="7" y="1" width="2" height="2" fill="#006600"/>
      <rect x="5" y="1" width="2" height="1" fill="#00aa00"/>
      <rect x="1" y="2" width="10" height="1" fill="#ff8800"/>
      <rect x="0" y="3" width="12" height="6" fill="#ff8800"/>
      <rect x="1" y="9" width="10" height="1" fill="#ff8800"/>
      <rect x="2" y="10" width="8" height="1" fill="#ff8800"/>
      <rect x="4" y="11" width="4" height="1" fill="#ff8800"/>
      <rect x="0" y="6" width="12" height="1" fill="#ee7700"/>
      <rect x="1" y="3" width="2" height="2" fill="#ffaa44"/>
    </svg>`;
  }

  private appleSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="2" fill="#3d2000"/>
      <rect x="7" y="1" width="3" height="2" fill="#00aa33"/>
      <rect x="1" y="2" width="10" height="1" fill="#ee1111"/>
      <rect x="0" y="3" width="5" height="7" fill="#ee1111"/>
      <rect x="7" y="3" width="5" height="7" fill="#ee1111"/>
      <rect x="5" y="3" width="2" height="9" fill="#cc1100"/>
      <rect x="1" y="10" width="4" height="1" fill="#ee1111"/>
      <rect x="7" y="10" width="4" height="1" fill="#ee1111"/>
      <rect x="2" y="11" width="8" height="1" fill="#ee1111"/>
      <rect x="1" y="3" width="2" height="3" fill="#ff4444"/>
    </svg>`;
  }

  private pearSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="2" fill="#3d2000"/>
      <rect x="3" y="2" width="6" height="2" fill="#aacc00"/>
      <rect x="2" y="4" width="8" height="4" fill="#ccdd22"/>
      <rect x="1" y="5" width="10" height="4" fill="#ccdd22"/>
      <rect x="2" y="9" width="8" height="1" fill="#ccdd22"/>
      <rect x="3" y="10" width="6" height="1" fill="#aacc00"/>
      <rect x="4" y="11" width="4" height="1" fill="#88aa00"/>
      <rect x="2" y="3" width="2" height="2" fill="#ddee44"/>
      <rect x="5" y="5" width="1" height="1" fill="#bbcc11"/>
    </svg>`;
  }

  private peachSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="1" height="2" fill="#00aa33"/>
      <rect x="1" y="2" width="10" height="1" fill="#ffaaaa"/>
      <rect x="0" y="3" width="12" height="6" fill="#ffaaaa"/>
      <rect x="1" y="9" width="10" height="1" fill="#ffaaaa"/>
      <rect x="2" y="10" width="8" height="1" fill="#ff8888"/>
      <rect x="4" y="11" width="4" height="1" fill="#ff6666"/>
      <rect x="5" y="1" width="2" height="11" fill="#ff8899"/>
      <rect x="1" y="3" width="2" height="3" fill="#ffcccc"/>
    </svg>`;
  }

  private pineappleSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="0" width="2" height="3" fill="#00aa33"/>
      <rect x="5" y="0" width="2" height="4" fill="#00cc44"/>
      <rect x="8" y="0" width="2" height="3" fill="#00aa33"/>
      <rect x="1" y="3" width="10" height="7" fill="#ffdd00"/>
      <rect x="2" y="10" width="8" height="1" fill="#ffdd00"/>
      <rect x="3" y="11" width="6" height="1" fill="#eebb00"/>
      <rect x="1" y="5" width="10" height="1" fill="#ccaa00"/>
      <rect x="1" y="7" width="10" height="1" fill="#ccaa00"/>
      <rect x="3" y="3" width="1" height="8" fill="#ccaa00"/>
      <rect x="6" y="3" width="1" height="8" fill="#ccaa00"/>
      <rect x="9" y="3" width="1" height="8" fill="#ccaa00"/>
    </svg>`;
  }

  private melonSVG(): string {
    return `<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0" width="2" height="1" fill="#3d2000"/>
      <rect x="1" y="1" width="10" height="2" fill="#99cc66"/>
      <rect x="0" y="3" width="12" height="6" fill="#99cc66"/>
      <rect x="1" y="9" width="10" height="2" fill="#99cc66"/>
      <rect x="3" y="11" width="6" height="1" fill="#77aa44"/>
      <rect x="0" y="4" width="12" height="1" fill="#bbee88"/>
      <rect x="0" y="7" width="12" height="1" fill="#bbee88"/>
      <rect x="2" y="1" width="1" height="10" fill="#bbee88"/>
      <rect x="5" y="1" width="1" height="10" fill="#aabb77"/>
      <rect x="9" y="1" width="1" height="10" fill="#bbee88"/>
      <rect x="1" y="2" width="2" height="2" fill="#ccee99"/>
    </svg>`;
  }

  private watermelonSVG(): string {
    return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="0" width="8" height="1" fill="#005500"/>
      <rect x="2" y="1" width="12" height="2" fill="#007700"/>
      <rect x="1" y="3" width="14" height="10" fill="#009900"/>
      <rect x="2" y="13" width="12" height="2" fill="#007700"/>
      <rect x="4" y="15" width="8" height="1" fill="#005500"/>
      <rect x="2" y="4" width="12" height="8" fill="#ff1155"/>
      <rect x="1" y="5" width="1" height="6" fill="#ff1155"/>
      <rect x="14" y="5" width="1" height="6" fill="#ff1155"/>
      <rect x="3" y="1" width="2" height="3" fill="#00bb00"/>
      <rect x="7" y="1" width="2" height="3" fill="#00aa00"/>
      <rect x="11" y="1" width="2" height="3" fill="#00bb00"/>
      <rect x="4" y="7" width="2" height="2" fill="#111111"/>
      <rect x="8" y="6" width="2" height="2" fill="#111111"/>
      <rect x="11" y="9" width="2" height="2" fill="#111111"/>
      <rect x="2" y="4" width="2" height="2" fill="#ff4477"/>
    </svg>`;
  }

  getCanvasForLevel(level: number): HTMLCanvasElement {
    if (this.cache.has(level)) {
      return this.cache.get(level)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.size;
    canvas.height = this.size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const svg = this.getSVGForLevel(level);
    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, this.size, this.size);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);

    this.cache.set(level, canvas);
    return canvas;
  }
}
