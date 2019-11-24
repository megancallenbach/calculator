import React, { Component } from 'react';
import _ from 'lodash';

const numberKeys = [
  { value: 0, order: 18 },
  { value: 1, order: 13 },
  { value: 2, order: 14 },
  { value: 3, order: 15 },
  { value: 4, order: 9 },
  { value: 5, order: 10 },
  { value: 6, order: 11 },
  { value: 7, order: 5 },
  { value: 8, order: 6 },
  { value: 9, order: 7 },
  { value: '.', order: 17 },
];

const mathKeys = [
  { value: '+', order: 2 },
  { value: '-', order: 3 },
  { value: '/', order: 4 },
  { value: 'x', order: 8 },
  { value: '^', order: 12 },
  { value: '√', order: 16 },
];

const Button = ({ value, onPress, order, flex }) => {
  return (
    <div className="btn" style={{order: order, flex: flex}} onClick={onPress}>
      {value}
    </div>
  );
}

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calculation: '0',
    }

    this.appendValue = this.appendValue.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  appendValue(value) {

    let calculation = this.state.calculation;

    let isNumberKey = _.findIndex(numberKeys, (obj) => obj.value === value) !== -1;
    let isMathKey = !isNumberKey && _.findIndex(mathKeys, (obj) => obj.value === value) !== -1;


    if (calculation === 'Infinity') {
      calculation = '0';
      value = '';

      // remove leading 0
    } else if (calculation === '0' && (isNumberKey || value === '√' || value === '-')) {
      calculation = '';

      // starting with a math key unsupported...
    } else if (calculation === '0') {
      value = '';

      // double math key replaces first one
    } else if (_.findIndex(mathKeys, (obj) => obj.value === calculation.slice(-1)) !== -1 && isMathKey) {

      let isAllowed = _.findIndex(mathKeys, (obj) => obj.value === calculation.slice(-2, -1)) === -1 && (value === '-' || (value === '√' && calculation.slice(-1) === '-'));

      if (!isAllowed) {
        calculation = calculation.slice(0, -1);
      }

      // no double decimals allowed
    } else if (value === '.') {

      let reversedCalc = calculation.split("").reverse().join("");
      let numberRegex = '^(?<number>[-]?[\\d]*[.]?[\\d]*(e+\\d*)?)';
      let numberMatch = reversedCalc.match(numberRegex);

      if (numberMatch && numberMatch['groups']['number'].indexOf('.') !== -1) {
        value = '';
      }
    }

    calculation = calculation + value;

    this.setState({ calculation: calculation });
  }

  calculate() {

    let calculation = this.state.calculation;

    let numbers = [];
    let operators = [];

    let numberRegex = '^(?<number>[-]?[\\d]*[.]?[\\d]*(e\\+\\d*)?)';
    let operatorRegex = '^(?<operator>[+\\-x/^√])';

    let findNumber = () => {
      let numberMatch = calculation.match(numberRegex);

      if (numberMatch && numberMatch['groups']['number']) {
        numbers.push(numberMatch['groups']['number']);

        calculation = calculation.substring(numberMatch['groups']['number'].length);
      }
    }

    let findOperator = () => {
      let operatorMatch = calculation.match(operatorRegex);

      if (operatorMatch && operatorMatch['groups']['operator']) {
        operators.push(operatorMatch['groups']['operator']);

        calculation = calculation.substring(operatorMatch['groups']['operator'].length);
      }
    }

    while (calculation.length !== 0) {
      findNumber();
      findOperator();
    }

    while (operators.length !== 0) {

      let orderOfOperations = [
        ['^', '√'],
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

              case '√':
                result = Number(firstNumber) * Math.sqrt(Number(secondNumber));
                break;
            }
          } else if (operator === '√' && firstNumber) {
            result = Math.sqrt(Number(firstNumber));
          }

          numbers[index] = result;

          index = _.findIndex(operators, (op) => prioOperators.indexOf(op) !== -1);

        }
      });

    }

    this.setState({ calculation: numbers[0].toString() });

  }

  render() {

    return (
      <div className="background">
        <div className="container">
          <div className="calculator">

            <div className="calculation">
              {this.state.calculation}
            </div>
            <div className="buttons">

                { numberKeys.map((btn) => (
                  <Button
                    value={btn.value.toString()}
                    order={btn.order}
                    onPress={() => this.appendValue(btn.value)}
                  />
                ))}
                { mathKeys.map((btn) => (
                  <Button
                    value={btn.value.toString()}
                    order={btn.order}
                    onPress={() => this.appendValue(btn.value)}
                  />
                ))}
                <Button
                  value='AC'
                  order={1}
                  onPress={() => this.setState({ calculation: '0'})}
                />
                <Button
                  value='='
                  order={19}
                  flex={2}
                  onPress={() => this.calculate()}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calculator;
