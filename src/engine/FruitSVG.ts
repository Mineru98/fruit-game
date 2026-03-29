import { Fruit } from './Fruit';

export class FruitSVG {
  private cache: Map<number, HTMLCanvasElement> = new Map();
  private readonly size = 80;

  getSVGForLevel(level: number): string {
    const fruits: Record<number, string> = {
      1: this.strawberrySVG(),
      2: this.grapeSVG(),
      3: this.orangeSVG(),
      4: this.bananaSVG(),
      5: this.peachSVG(),
      6: this.kiwiSVG(),
      7: this.pomelSVG(),
      8: this.appleSVG(),
      9: this.pearSVG(),
      10: this.melonSVG(),
      11: this.melonKingSVG(),
    };
    return fruits[level] || fruits[1];
  }

  private strawberrySVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="35" ry="40" fill="#FF6B6B"/>
      <circle cx="40" cy="40" r="3" fill="#FFD700"/>
      <circle cx="50" cy="35" r="3" fill="#FFD700"/>
      <circle cx="60" cy="40" r="3" fill="#FFD700"/>
      <circle cx="35" cy="55" r="3" fill="#FFD700"/>
      <circle cx="50" cy="60" r="3" fill="#FFD700"/>
      <circle cx="65" cy="55" r="3" fill="#FFD700"/>
      <path d="M 45 15 Q 50 10 55 15 L 50 25 Z" fill="#228B22"/>
    </svg>`;
  }

  private grapeSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="30" r="12" fill="#4ECDC4"/>
      <circle cx="50" cy="25" r="12" fill="#4ECDC4"/>
      <circle cx="65" cy="30" r="12" fill="#4ECDC4"/>
      <circle cx="30" cy="50" r="12" fill="#4ECDC4"/>
      <circle cx="50" cy="45" r="12" fill="#4ECDC4"/>
      <circle cx="70" cy="50" r="12" fill="#4ECDC4"/>
      <circle cx="40" cy="65" r="12" fill="#4ECDC4"/>
      <circle cx="60" cy="65" r="12" fill="#4ECDC4"/>
      <path d="M 50 15 L 48 8 L 52 8 Z" fill="#228B22"/>
    </svg>`;
  }

  private orangeSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#FFE66D"/>
      <circle cx="40" cy="35" r="4" fill="#FFA500"/>
      <circle cx="60" cy="35" r="4" fill="#FFA500"/>
      <circle cx="35" cy="55" r="4" fill="#FFA500"/>
      <circle cx="65" cy="55" r="4" fill="#FFA500"/>
      <circle cx="50" cy="70" r="4" fill="#FFA500"/>
    </svg>`;
  }

  private bananaSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 60 Q 50 20 80 30" stroke="#FFD700" stroke-width="35" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  private peachSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="38" fill="#FF8B94"/>
      <circle cx="50" cy="30" r="12" fill="#FF9999"/>
    </svg>`;
  }

  private kiwiSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="38" fill="#A8E6CF"/>
      <circle cx="50" cy="50" r="28" fill="#90EE90"/>
      <circle cx="40" cy="40" r="3" fill="#333"/>
      <circle cx="50" cy="35" r="3" fill="#333"/>
      <circle cx="60" cy="40" r="3" fill="#333"/>
      <circle cx="35" cy="55" r="3" fill="#333"/>
      <circle cx="50" cy="60" r="3" fill="#333"/>
      <circle cx="65" cy="55" r="3" fill="#333"/>
    </svg>`;
  }

  private pomelSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="38" fill="#B8B8FF"/>
      <circle cx="40" cy="40" r="8" fill="#C8C8FF"/>
      <circle cx="60" cy="40" r="8" fill="#C8C8FF"/>
      <circle cx="50" cy="55" r="8" fill="#C8C8FF"/>
    </svg>`;
  }

  private appleSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="45" cy="50" r="35" fill="#FFDAC1"/>
      <circle cx="55" cy="50" r="35" fill="#FFDAC1"/>
      <path d="M 50 20 Q 45 15 50 10 Q 55 15 50 20" fill="#228B22"/>
      <line x1="50" y1="10" x2="48" y2="5" stroke="#8B4513" stroke-width="1"/>
    </svg>`;
  }

  private pearSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="60" r="30" fill="#E2F0CB"/>
      <ellipse cx="50" cy="35" rx="20" ry="25" fill="#E2F0CB"/>
      <path d="M 50 15 L 48 8 L 52 8 Z" fill="#228B22"/>
    </svg>`;
  }

  private melonSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#C7CEEA"/>
      <path d="M 30 50 Q 50 35 70 50" stroke="#228B22" stroke-width="3" fill="none"/>
      <path d="M 30 55 Q 50 40 70 55" stroke="#228B22" stroke-width="3" fill="none"/>
      <path d="M 30 45 Q 50 30 70 45" stroke="#228B22" stroke-width="3" fill="none"/>
    </svg>`;
  }

  private melonKingSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="40" fill="#2E8B57"/>
      <path d="M 30 55 Q 50 40 70 55" stroke="#FFD700" stroke-width="3" fill="none"/>
      <path d="M 30 60 Q 50 45 70 60" stroke="#FFD700" stroke-width="3" fill="none"/>
      <path d="M 30 50 Q 50 35 70 50" stroke="#FFD700" stroke-width="3" fill="none"/>
      <polygon points="50,15 45,25 55,25" fill="#FFD700"/>
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
      ctx.drawImage(img, 0, 0, this.size, this.size);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);

    this.cache.set(level, canvas);
    return canvas;
  }
}
