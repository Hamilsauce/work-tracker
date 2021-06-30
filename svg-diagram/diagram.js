import { arrowLine } from './svg-comp1.js';

console.log('arrowLine');
console.log(arrowLine);

const app = document.querySelector('.app')
// app.appendChild(arrowLine)
app.insertAdjacentElement("beforeend",arrowLine())
console.log(app);