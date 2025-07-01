class QuadraticEquation {

  solve(a, b, c) {
    const EPSILON = 1e-10;

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      throw new Error('Wrong arguments');
    }

    if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
      throw new Error('Arguments must be finite numbers');
    }

    if (Math.abs(a) < EPSILON) {
      throw new Error('First argument shuld not be 0');
    }

    const roots = [];
    const d = b * b - 4 * a * c;

    if (d > EPSILON) {
      roots.push((-b + Math.sqrt(d)) / (2 * a));
      roots.push((-b - Math.sqrt(d)) / (2 * a));
    } else if (Math.abs(d) < EPSILON) {
      roots.push(-b / (2 * a));
    }
      
    return roots;
  }
}

module.exports = QuadraticEquation;
