import React, { Component } from 'react';
import _ from 'lodash';

const numericKeys = _.range(10).reverse();

const controlKeys = ['+', '-', 'x', '/', '√'];

const Button = ({ value, onPress, order, flex }) => {
  return (
    <div className="btn btn-simple" style={{order: order, flex: flex}} onClick={onPress}>
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

    if (calculation === '0' && numericKeys.indexOf(value) !== -1) {
      calculation = '';
    } else if (calculation === '0') {
      value = '';
    } else if (controlKeys.indexOf(calculation.slice(-1)) !== -1 && controlKeys.indexOf(value) !== -1) {
      calculation = calculation.slice(0, -1);
    }

    calculation = calculation + value;

    this.setState({ calculation: calculation });
  }

  calculate() {

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
              <div className="numeric-buttons">
                { numericKeys.map((btn) => (
                  <Button
                    value={btn.toString()}
                    order={btn === 0 ? 3 : 1}
                    onPress={() => this.appendValue(btn)}
                  />
                ))}
                <Button
                  value=','
                  order={2}
                  onPress={() => this.appendValue(',')}
                />
                <Button
                  value='AC'
                  order={4}
                  onPress={() => this.setState({ calculation: '0'})}
                />
                <Button
                  value={'^'}
                  order={5}
                  onPress={() => this.calculate()}
                />
                <Button
                  value={'='}
                  order={6}
                  flex={2}
                  onPress={() => this.calculate()}
                />
              </div>
              <div className="control-buttons">
                { controlKeys.map((btn) => (
                  <Button
                    value={btn.toString()}
                    onPress={() => this.appendValue(btn)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calculator;
