const QuadraticEquation = require('./quadratic-equation.js');

describe('QuadraticEquation', () => {
  const equation = new QuadraticEquation();

  test('should return an empty array for x^2 + 1 = 0', () => {
    expect(equation.solve(1, 0, 1)).toEqual([]);
  });

  test('should return an array length 2 for x^2 - 1 = 0', () => {
    expect(equation.solve(1, 0, -1)).toEqual([1, -1]);
  });

  test('should return an array length 1 for x^2 + 2x + 1 = 0', () => {
    expect(equation.solve(1, 2, 1)).toEqual([-1]);
  });

  test('should get exception if first argument is 0', () => {
    expect(() => equation.solve(0, 2, 1)).toThrow();
  });

  test('should get exception if first arguments is not a number', () => {
    expect(() => equation.solve('a', 1, 1)).toThrow();
  });

  test('should get exception if second arguments is not a number', () => {
    expect(() => equation.solve(1, 'b', 1)).toThrow();
  });

  test('should get exception if third arguments is not a number', () => {
    expect(() => equation.solve(1, 1, 'c')).toThrow();
  });
});

