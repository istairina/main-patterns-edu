class QuadraticEquation {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  solve() {
    const EPSILON = 1e-10;

    if (typeof this.a !== 'number' || Math.abs(this.a) < EPSILON) {
      throw new Error('Wrong first argument');
    }

    const roots = [];
    const d = this.b * this.b - 4 * this.a * this.c;

    if (d >= 0) {
      roots.push((-this.b + Math.sqrt(d)) / (2 * this.a));

      if (d > 0) {
        roots.push((-this.b - Math.sqrt(d)) / (2 * this.a));
      }
    }
    
    return roots;
  }
}

module.exports = QuadraticEquation;
