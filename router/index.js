import Vue from '../.vue/vue.js';
import Router from '../.vue/vue-router.js';
import CardView from '../components/card-view.js';

// Vue.use(Router);


// const router = new VueRouter({
export const router = new VueRouter({
	routes: [
		{ path: '/', component: CardView }
		// { path: '/product/:product_id', component: Product, name: 'product' },
		// { path: '/add-product', component: AddProduct },
		// { path: '/product/:product_id/edit', component: ProductEdit, name: 'product-edit' },
		// { path: '/product/:product_id/delete', component: ProductDelete, name: 'product-delete' }
		]
});
