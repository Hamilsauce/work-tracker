import Vue from '../.vue/vue.js'

	// const Card = Vue.component('card', {
	export default Vue.component('card', {
		// name: 'card',
		template: '#card',
		props: {
			thing: Number
		},
		data() {
			return {
				fuck: 'me'
				// product: findProduct(this.$route.params.product_id)
			}
		}
	});

{
	// Card
}