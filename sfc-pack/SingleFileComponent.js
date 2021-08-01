// import Vue from './vue.js'


export default {
	template: `
    <div>
     <h1>Single-file JavaScript Component</h1>
     <p>{{ msg }}</p>
    </div>
  `,
	props: {
		message: String
	},
	data() {
		return {
			msg: this.message,
		// childMessage: message,
		message2: 'Ohai from the component'
			
		}
	},
	mounted() {
		console.log('fuck');
	}
};