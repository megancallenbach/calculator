import _ from 'lodash';

export default (calculation) => {

  let numbers = [];
  let operators = [];

  let numberRegex = '^([√]?[-]?[\\d]*[.]?[\\d]*(e\\+\\d*)?)';
  let operatorRegex = '^([+\\-x/^])';

  let findNumber = () => {
    let numberMatch = calculation.match(numberRegex);

    if (numberMatch && numberMatch[0]) {
      numbers.push(numberMatch[0]);

      calculation = calculation.substring(numberMatch[0].length);
    }
  }

  let findOperator = () => {
    let operatorMatch = calculation.match(operatorRegex);

    if (operatorMatch && operatorMatch[0]) {
      operators.push(operatorMatch[0]);

      calculation = calculation.substring(operatorMatch[0].length);
    }
  }

  while (calculation.length !== 0) {
    findNumber();
    findOperator();

    if (numbers.length === 0 && operators.length === 0) {
      return 'Error';
    }
  }

  // Evaluate square roots first
  numbers = numbers.map((number) => {
    number = number.toString();
    if (number.charAt(0) === '√') {
      return Math.sqrt(Number(number.slice(1, number.length)));
    }
    return number;
  });

  while (operators.length !== 0) {

    let orderOfOperations = [
      ['^'],
      ['x', '/'],
      ['+', '-'],
    ];

    orderOfOperations.forEach((prioOperators) => {

      let index = _.findIndex(operators, (op) => prioOperators.indexOf(op) !== -1);

      while (index !== -1) {

        let result = null;

        let operator = operators[index];

        operators.splice(index, 1);

        let firstNumber = numbers[index];
        let secondNumber = numbers[index + 1];

        numbers.splice((index), 1);

        if (firstNumber != null && operator && secondNumber !== null) {
          switch (operator) {
            case 'x':
              result = Number(firstNumber) * Number(secondNumber);
              break;

            case '/':
              result = Number(firstNumber) / Number(secondNumber);
              break;

            case '^':
              result = Math.pow(Number(firstNumber), Number(secondNumber));
              break;

            case '+':
              result = Number(firstNumber) + Number(secondNumber);
              break;

            case '-':
              result = Number(firstNumber) - Number(secondNumber);
              break;
          }
        }

        numbers[index] = result;

        index = _.findIndex(operators, (op) => prioOperators.indexOf(op) !== -1);

      }
    });
  }

  if (isNaN(numbers[0])) {
    return 'Error';
  }

  return numbers[0];
}
