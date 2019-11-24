import React from 'react';
import ReactDOM from 'react-dom';
import Calculator from '../components/Calculator';
import calculate from '../utils/calculate';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Calculator />, div);
  ReactDOM.unmountComponentAtNode(div);
});

let expression = '';
it ('calculates the expression correctly', () => {
  expression = '2+3+4-4x3';
  expect(calculate(expression)).toBe(-3);

  expression = '0+3+4';
  expect(calculate(expression)).toBe(7);

  expression = '-9x10';
  expect(calculate(expression)).toBe(-90);

  expression = '45x√25';
  expect(calculate(expression)).toBe(225);

  expression = '20+√25';
  expect(calculate(expression)).toBe(25);

  expression = '25^5-25';
  expect(calculate(expression)).toBe(9765600);
});

it ('calculates with correct order of operations', () => {
  expression = '23+10x2^2';
  expect(calculate(expression)).toBe(63);

  expression = '2^√25';
  expect(calculate(expression)).toBe(32);

  expression = '2^√25-12x2';
  expect(calculate(expression)).toBe(8);
});

it ('calculates and interprets exponent notation', () => {
  expression = '1.5e+24x2';
  expect(calculate(expression)).toBe(3e+24);

  expression = '5.12345e+5+10';
  expect(calculate(expression)).toBe(512355);
});

it ('calculates negative numbers', () => {
  expression = '-54x10';
  expect(calculate(expression)).toBe(-540);

  expression = '-10x-10';
  expect(calculate(expression)).toBe(100);

  expression = '-10--10';
  expect(calculate(expression)).toBe(0);

  expression = '-21010x2+-20';
  expect(calculate(expression)).toBe(-42040);
});


it ('calculates square roots', () => {
  expression = '√25';
  expect(calculate(expression)).toBe(5);
});

it ('returns "Error" with negative square roots', () => {
  expression = '√-25';
  expect(calculate(expression)).toBe('Error');
});

it ('returns "Error" with no valid calculation input', () => {
  expression = '';
  expect(calculate(expression)).toBe('Error');

  expression = 'Hello world';
  expect(calculate(expression)).toBe('Error');

  expression = 'Error';
  expect(calculate(expression)).toBe('Error');

  expression = 'Infinity';
  expect(calculate(expression)).toBe('Error');
});
