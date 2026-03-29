export class SoundEngine {
  private ctx: AudioContext | null = null;
  private _muted = false;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get muted(): boolean {
    return this._muted;
  }

  toggle(): boolean {
    this._muted = !this._muted;
    return !this._muted;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    volume = 0.12,
    delay = 0,
  ) {
    if (this._muted) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  /** 과일 드롭 — 짧은 하강 칩튠 */
  drop() {
    this.tone(520, 0.07, 'square', 0.10);
    this.tone(380, 0.06, 'square', 0.08, 0.05);
  }

  /** 과일 합체 — 레벨에 따라 상승하는 아르페지오 */
  merge(level: number) {
    const base = 260 + level * 35;
    this.tone(base, 0.07, 'square', 0.10);
    this.tone(base * 1.25, 0.07, 'square', 0.10, 0.06);
    this.tone(base * 1.5, 0.10, 'square', 0.13, 0.12);
    if (level >= 6) {
      this.tone(base * 2, 0.14, 'square', 0.11, 0.18);
    }
  }

  /** 게임 오버 — 하강하는 슬픈 톤 */
  gameOver() {
    this.tone(440, 0.18, 'square', 0.13);
    this.tone(370, 0.18, 'square', 0.13, 0.18);
    this.tone(330, 0.18, 'square', 0.13, 0.36);
    this.tone(262, 0.35, 'triangle', 0.10, 0.54);
  }
}
