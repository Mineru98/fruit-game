class CollisionDetector {
  constructor() {
    this.collisionPairs = [];
  }

  detectCollision(fruit1, fruit2) {
    if (!fruit1.isActive || !fruit2.isActive) return false;
    const dx = fruit2.x - fruit1.x;
    const dy = fruit2.y - fruit1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < fruit1.radius + fruit2.radius;
  }

  findCollisions(fruits) {
    const pairs = [];
    for (let i = 0; i < fruits.length; i++) {
      for (let j = i + 1; j < fruits.length; j++) {
        if (fruits[i].isActive && fruits[j].isActive) {
          if (this.detectCollision(fruits[i], fruits[j])) {
            pairs.push([i, j]);
          }
        }
      }
    }
    return pairs;
  }

  canMerge(fruit1, fruit2) {
    if (!fruit1.isActive || !fruit2.isActive) return false;
    if (fruit1.level !== fruit2.level) return false;
    return this.detectCollision(fruit1, fruit2);
  }

  getMergePosition(fruit1, fruit2) {
    return {
      x: (fruit1.x + fruit2.x) / 2,
      y: (fruit1.y + fruit2.y) / 2,
    };
  }

  getMergeVelocity(fruit1, fruit2) {
    return {
      vx: (fruit1.vx + fruit2.vx) / 2,
      vy: (fruit1.vy + fruit2.vy) / 2,
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollisionDetector;
}
