class InputHandler {
  constructor() {
    this.keys = {};
    this.direction = 0;
    this.firePressed = false;

    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this._handleKeyDown);
      document.addEventListener('keyup', this._handleKeyUp);
    }
  }

  _handleKeyDown(e) {
    this.keys[e.code] = true;
    if (e.code === 'ArrowLeft') {
      this.direction = -1;
      e.preventDefault();
    } else if (e.code === 'ArrowRight') {
      this.direction = 1;
      e.preventDefault();
    } else if (e.code === 'Space') {
      this.firePressed = true;
      e.preventDefault();
    }
  }

  _handleKeyUp(e) {
    this.keys[e.code] = false;
    if (e.code === 'ArrowLeft' && this.direction === -1) {
      this.direction = 0;
    } else if (e.code === 'ArrowRight' && this.direction === 1) {
      this.direction = 0;
    } else if (e.code === 'Space') {
      this.firePressed = false;
    }
  }

  getDirection() {
    return this.direction;
  }

  isFiring() {
    if (this.firePressed) {
      this.firePressed = false;
      return true;
    }
    return false;
  }

  reset() {
    this.keys = {};
    this.direction = 0;
    this.firePressed = false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputHandler;
}
