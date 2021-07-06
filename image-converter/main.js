import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

ham.log(ham.qs('form'))

document.querySelector('form').addEventListener('submit', e => {
  console.log(e.target);
  e.preventDefault();
  convert()
})