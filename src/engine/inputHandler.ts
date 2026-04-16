export class InputHandler {
  private keys: Record<string, boolean> = {};
  private handleKeyDown: (e: KeyboardEvent) => void;
  private handleKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
      this.keys[e.key] = true;
    };
    this.handleKeyUp = (e: KeyboardEvent) => {
      this.keys[e.key] = false;
    };
    this.setupListeners();
  }

  private setupListeners(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  destroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
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
