const QuadraticEquation = require('./quadratic-equation.js');

test('should return an empty array for x^2 + 1 = 0', () => {
  const equation = new QuadraticEquation(1, 0, 1);
  expect(equation.solve()).toEqual([]);
});
