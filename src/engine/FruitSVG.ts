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
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 30 Q50 10 35 15 M50 30 Q50 10 65 15" stroke="#5d4037" stroke-width="3" fill="none"/>
      <circle cx="35" cy="55" r="22" fill="#ff5252"/>
      <circle cx="65" cy="55" r="22" fill="#d32f2f"/>
      <circle cx="30" cy="48" r="5" fill="white" opacity="0.4"/>
      <circle cx="60" cy="48" r="5" fill="white" opacity="0.4"/>
      <circle cx="30" cy="58" r="2"/>
      <circle cx="40" cy="58" r="2"/>
      <path d="M33 63 Q35 65 37 63" stroke="black" fill="none"/>
      <circle cx="60" cy="58" r="2"/>
      <circle cx="70" cy="58" r="2"/>
      <path d="M63 63 Q65 65 67 63" stroke="black" fill="none"/>
    </svg>`;
  }

  private strawberrySVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 95 C25 95 15 55 25 35 C35 15 65 15 75 35 C85 55 75 95 50 95Z" fill="#ff1744"/>
      <path d="M35 25 Q50 10 65 25 Q50 35 35 25Z" fill="#4caf50"/>
      <circle cx="40" cy="50" r="1.5" fill="#ffeb3b"/>
      <circle cx="60" cy="45" r="1.5" fill="#ffeb3b"/>
      <circle cx="50" cy="65" r="1.5" fill="#ffeb3b"/>
      <circle cx="35" cy="70" r="1.5" fill="#ffeb3b"/>
      <circle cx="65" cy="75" r="1.5" fill="#ffeb3b"/>
      <circle cx="45" cy="55" r="3"/>
      <circle cx="55" cy="55" r="3"/>
      <path d="M47 62 Q50 65 53 62" stroke="black" fill="none" stroke-width="1.5"/>
    </svg>`;
  }

  private grapeSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="35" r="15" fill="#9c27b0"/>
      <circle cx="60" cy="35" r="15" fill="#7b1fa2"/>
      <circle cx="35" cy="55" r="15" fill="#8e24aa"/>
      <circle cx="55" cy="55" r="15" fill="#6a1b9a"/>
      <circle cx="50" cy="75" r="15" fill="#4a148c"/>
      <path d="M50 25 L50 10" stroke="#4caf50" stroke-width="4"/>
      <circle cx="36" cy="50" r="3" fill="white" opacity="0.3"/>
      <circle cx="56" cy="50" r="3" fill="white" opacity="0.3"/>
    </svg>`;
  }

  private dekoponfSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="40" fill="#ff9800"/>
      <circle cx="50" cy="20" r="12" fill="#ff9800"/>
      <circle cx="45" cy="15" r="2" fill="#4caf50"/>
      <circle cx="40" cy="45" r="4"/>
      <circle cx="60" cy="45" r="4"/>
      <path d="M45 55 Q50 60 55 55" stroke="black" fill="none" stroke-width="2"/>
      <circle cx="35" cy="40" r="6" fill="white" opacity="0.3"/>
    </svg>`;
  }

  private kakiSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="70" height="60" rx="20" fill="#fb8c00"/>
      <path d="M35 25 Q50 15 65 25 L50 35 Z" fill="#2e7d32"/>
      <circle cx="40" cy="50" r="4"/>
      <circle cx="60" cy="50" r="4"/>
      <path d="M45 60 Q50 65 55 60" stroke="black" fill="none" stroke-width="2"/>
      <circle cx="30" cy="40" r="6" fill="white" opacity="0.2"/>
    </svg>`;
  }

  private appleSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 90 C20 90 15 40 30 30 C40 20 60 20 70 30 C85 40 80 90 50 90Z" fill="#f44336"/>
      <path d="M50 25 L50 10" stroke="#5d4037" stroke-width="3"/>
      <path d="M50 15 Q65 10 70 20 Q55 25 50 15" fill="#4caf50"/>
      <circle cx="40" cy="50" r="4"/>
      <circle cx="60" cy="50" r="4"/>
      <path d="M45 60 Q50 65 55 60" stroke="black" fill="none" stroke-width="2"/>
      <circle cx="35" cy="40" r="6" fill="white" opacity="0.3"/>
    </svg>`;
  }

  private pearSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 95 C25 95 20 60 30 50 C35 40 40 15 50 15 C60 15 65 40 70 50 C80 60 75 95 50 95Z" fill="#cddc39"/>
      <path d="M50 15 L50 5" stroke="#5d4037" stroke-width="3"/>
      <circle cx="40" cy="55" r="4"/>
      <circle cx="60" cy="55" r="4"/>
      <path d="M45 65 Q50 70 55 65" stroke="black" fill="none" stroke-width="2"/>
      <circle cx="40" cy="45" r="5" fill="white" opacity="0.2"/>
    </svg>`;
  }

  private peachSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 90 C20 90 10 50 30 30 C45 15 50 30 50 30 C50 30 55 15 70 30 C90 50 80 90 50 90Z" fill="#ff8a80"/>
      <path d="M50 30 L50 90" stroke="#ff5252" stroke-width="1" opacity="0.5"/>
      <path d="M35 30 Q20 10 40 20 Q50 30 35 30" fill="#4caf50"/>
      <circle cx="40" cy="55" r="4"/>
      <circle cx="60" cy="55" r="4"/>
      <path d="M45 65 Q50 70 55 65" stroke="black" fill="none" stroke-width="2"/>
      <circle cx="35" cy="45" r="8" fill="white" opacity="0.3"/>
    </svg>`;
  }

  private pineappleSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="65" rx="30" ry="35" fill="#ffeb3b"/>
      <path d="M50 35 L40 10 L50 25 L60 10 Z" fill="#4caf50"/>
      <path d="M50 35 L30 15 L45 30 L50 15 L55 30 L70 15 Z" fill="#388e3c"/>
      <path d="M30 50 L70 50 M30 65 L70 65 M30 80 L70 80 M40 40 L40 90 M60 40 L60 90" stroke="#fbc02d" stroke-width="1"/>
      <circle cx="40" cy="60" r="4"/>
      <circle cx="60" cy="60" r="4"/>
      <path d="M45 70 Q50 75 55 70" stroke="black" fill="none" stroke-width="2"/>
    </svg>`;
  }

  private melonSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="40" fill="#aed581"/>
      <path d="M50 15 Q40 5 50 0 Q60 5 50 15" fill="none" stroke="#558b2f" stroke-width="3"/>
      <path d="M20 55 Q50 45 80 55 M25 40 Q50 30 75 40 M25 70 Q50 60 75 70" stroke="#f1f8e9" stroke-width="1.5" fill="none" opacity="0.6"/>
      <circle cx="40" cy="50" r="5"/>
      <circle cx="60" cy="50" r="5"/>
      <path d="M45 65 Q50 70 55 65" stroke="black" fill="none" stroke-width="2.5"/>
    </svg>`;
  }

  private watermelonSVG(): string {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#2e7d32"/>
      <path d="M30 10 Q40 50 30 90 M50 5 Q60 50 50 95 M70 10 Q80 50 70 90" stroke="#1b5e20" stroke-width="8" fill="none"/>
      <circle cx="40" cy="45" r="6"/>
      <circle cx="60" cy="45" r="6"/>
      <path d="M42 65 Q50 75 58 65" stroke="black" fill="none" stroke-width="3"/>
      <circle cx="35" cy="35" r="10" fill="white" opacity="0.1"/>
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
