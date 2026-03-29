class Fruit {
  static COLORS = {
    1: '#FF6B6B',
    2: '#4ECDC4',
    3: '#FFE66D',
    4: '#A8E6CF',
    5: '#FF8B94',
    6: '#B8B8FF',
    7: '#FFDAC1',
    8: '#E2F0CB',
    9: '#C7CEEA',
    10: '#FF9AA2',
    11: '#2E8B57',
  };

  constructor(x, y, level = 1) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.vx = 0;
    this.vy = 0;
    this.radius = Fruit.getRadius(level);
    this.color = Fruit.COLORS[level] || Fruit.COLORS[11];
    this.isActive = true;
    this.createdAt = Date.now();
  }

  static getRadius(level) {
    return 15 + (level - 1) * 5;
  }

  static getScoreForLevel(level) {
    return Math.pow(2, level) * 10;
  }

  static getNextLevel(level) {
    return level + 1;
  }

  updatePosition() {
    this.x += this.vx;
    this.y += this.vy;
  }

  getScore() {
    return Fruit.getScoreForLevel(this.level);
  }

  isCollidingWith(otherFruit) {
    const dx = otherFruit.x - this.x;
    const dy = otherFruit.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + otherFruit.radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Fruit;
}
