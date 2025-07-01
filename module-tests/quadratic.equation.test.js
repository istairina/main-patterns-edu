const QuadraticEquation = require('./quadratic-equation.js');

test('should return an empty array for x^2 + 1 = 0', () => {
  const equation = new QuadraticEquation(1, 0, 1);
  expect(equation.solve()).toEqual([]);
});

test('should return an array length 2 for x^2 - 1 = 0', () => {
  const equation = new QuadraticEquation(1, 0, -1);
  expect(equation.solve()).toEqual([1, -1]);
});

test('should return an array length 1 for x^2 + 2x + 1 = 0', () => {
  const equation = new QuadraticEquation(1, 2, 1);
  expect(equation.solve()).toEqual([-1]);
});
