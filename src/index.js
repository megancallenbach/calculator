import React from 'react';
import ReactDOM from 'react-dom';
import Calculator from './components/Calculator';
import * as serviceWorker from './serviceWorker';
import './main.scss'

ReactDOM.render(
    <Calculator />
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();