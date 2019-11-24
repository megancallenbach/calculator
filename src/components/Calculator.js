import React, { Component } from 'react';
import _ from 'lodash';
import calculate from '../utils/calculate';

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
    this.doCalculation = this.doCalculation.bind(this);
  }

  appendValue(value) {

    let calculation = this.state.calculation;

    let isNumberKey = (key) => _.findIndex(numberKeys, (obj) => obj.value.toString() === key.toString()) !== -1;
    let isMathKey = (key) => !isNumberKey(key) && _.findIndex(mathKeys, (obj) => obj.value === key) !== -1;

    let lastKey = calculation.slice(-1);
    let secondLastKey = calculation.slice(-2, -1);

      // infinity not supported, reset to 0.
    if (calculation === 'Infinity' || calculation === 'Error') {
      calculation = '';

      // remove leading 0 when key is a valid starting character
    } else if (calculation === '0' && (isNumberKey(value) || value === '√' || value === '-')) {
      calculation = '';

      // starting with a math key (thats not '-' or '√') is unsupported...
    } else if (calculation === '0') {
      value = '';

      // assume multiplication with a number and then square root (no operator in between)
    } else if (value === '√' && (!isMathKey(lastKey) || lastKey === '√')) {

      if (secondLastKey === 'x' && lastKey === '√') {
        value = '';
      } else {
        calculation += 'x';
      }

      // double math key replaces first one
    } else if (isMathKey(lastKey) && isMathKey(value)) {

      // replace the operator and minus value from calculation when the operator changes
      if (isMathKey(secondLastKey) && lastKey === '-') {
        calculation = calculation.slice(0, -1);
      }

      let minusAllowed = (!secondLastKey || isNumberKey(secondLastKey) || secondLastKey === 'x') && value === '-' && isMathKey(lastKey);
      let isAllowed = minusAllowed || (isMathKey(lastKey) && (value === '√' && lastKey !== '√'));

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

    calculation += value;

    this.setState({ calculation: calculation });
  }

  doCalculation() {

    let calculation = this.state.calculation;

    this.setState({ calculation: calculate(calculation).toString() });

  }

  render() {

    let smallerFont = 4.5 - (this.state.calculation.length / 5 / 2.6);
    let calculationFontSize = (this.state.calculation.length > 18 ? smallerFont < 2.3 ? 2.3 : smallerFont : 3.5);

    return (
      <div className="background">
        <div className="container">
          <div className="calculator">

            <div className="calculation" style={{ fontSize: calculationFontSize + 'rem' }}>
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
                  onPress={() => this.doCalculation()}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calculator;
