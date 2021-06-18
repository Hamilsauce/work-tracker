import Vue from './vue.js'
import SingleFileComponent from './SingleFileComponent.js';


// setTimeout(() => {
let app = new Vue({
  el: '#app',
  components: {
    SingleFileComponent
  },
  // template: `<single-file-component></single-file-component>`,
  data() {
  	return {
  		message: 'from app',
			things: [1,2,3,4]
  	}
  }
});
// }, 1000)
