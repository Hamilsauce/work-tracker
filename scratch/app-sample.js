import Vue from './.vue/vue.js'
// import Router from './.vue/vue-router.js'
import SingleFileComponent from './sfc-pack/SingleFileComponent.js';
// import router from './router/index.js'
import CardView from '../components/card-view.js';
// import workData from './data/work-data.js'
// const cardview = new CardView()
// console.log(cardview);
// Vue.use(Router)
// setTimeout(() => 

const router = new VueRouter({
	routes: [
		{ path: '/', component: CardView }
		// { path: '/product/:product_id', component: Product, name: 'product' },
		// { path: '/add-product', component: AddProduct },
		// { path: '/product/:product_id/edit', component: ProductEdit, name: 'product-edit' },
		// { path: '/product/:product_id/delete', component: ProductDelete, name: 'product-delete' }
		]
});

let app = new Vue({
  el: '#app',
  // router: router,
  components: {
    SingleFileComponent,
    CardView, router
   },
  data() {
  	return {
  		message: 'from app',
			things: [1,2,3,4]
  	}
  },
  template: `
  <div class="app">
		<div class="nav"></div> 
		<div class="form-modal-container hide"></div>
		<header class="header">
			<img class="menu-button" src="./assets/ellipsis.svg" alt="menu-button" />
			<div class="header-title">
				Work Tracker
			</div>
		</header>
			<router-view></router-view>
		<div class="app-body">
		
			<!-- router link -->
		</div>
		<footer class="footer"></footer>
 </div>
  `
})
