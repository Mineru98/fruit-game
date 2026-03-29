export class InputHandler {
  private keys: Record<string, boolean> = {};

  constructor() {
    this.setupListeners();
  }

  private setupListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  getDirection(): -1 | 0 | 1 {
    if (this.keys['ArrowLeft']) return -1;
    if (this.keys['ArrowRight']) return 1;
    return 0;
  }

  isFiring(): boolean {
    return this.keys[' '] || false;
  }

  reset(): void {
    this.keys = {};
  }
}
