import storeObj from './store/index.js'
import { workHistory } from './data/work-data.js'
import { exportAsJson, exportAsCsv } from './services/fileSaver.js'

const products = [
	{ id: 1, name: 'Angular', description: 'Superheroic JavaScript MVW Framework.', price: 100 },
	{ id: 2, name: 'Ember', description: 'A framework for creating ambitious web applications.', price: 100 },
	{ id: 3, name: 'React', description: 'A JavaScript Library for building user interfaces.', price: 100 }
];

function findProduct(productId) {
	return products[findProductKey(productId)];
};

function findProductKey(productId) {
	for (var key = 0; key < products.length; key++) {
		if (products[key].id == productId) {
			return key;
		}
	}
};

const DeleteCardModal = Vue.component('delete-card-modal', {
	template: '#delete-card-modal',
	methods: {
		deleteConfirmed() {
			store.commit('deleteCard');
			store.commit('toggleDeleteModal')
		},
		deleteCanceled() {store.commit('toggleDeleteModal')},
	},
});

const AppNav = Vue.component('app-nav', {
	template: '#app-nav',
	props: { showNav: Boolean },
	methods: {
		closeNav() { setTimeout(() => { this.$emit('toggle-nav', false) }, 200) },
		exportJsonClicked() { this.$emit('export-json') },
		exportCsvClicked() { this.$emit('export-csv') }
	},
});

const AppHeader = Vue.component('app-header', {
	template: '#app-header',
	data() {
		return {
			title: 'Work Tracker'
		}
	},
	methods: {
		handleMenuClick() { this.$emit('toggle-nav', true) }
	}
});

//	!! AddShift

const AddShiftView = Vue.component('add-shift-view', {
	name: 'add-shift-view',
	template: '#add-shift-view',
	props: {
		data: String //work history array passed as json
	},
	data() {
		return {
			newShift: {
				date: null,
				hours: null,
				details: '',
				createdDate: null,
			}
		}
	},
	methods: {
		handleFormSubmit(e) {
			e.preventDefault()
			if (this.validateForm()) {
				this.newShift.date = dayjs(this.newShift.date).format('MM/DD/YYYY')
				store.dispatch('storeHistory', this.newShift)
				router.push('/')
			} else {
				return
			}
		},
		handleFormCancel() { router.push('/') },
		validateForm() { return !this.newShift.date || !this.newShift.hours ? false : true }
	},
});

//	!! Card

const Card = Vue.component('card', {
	template: '#card',
	props: {
		shift: Object,
		selectedCardId: Number,
		editCardId: Number
	},
	data() {
		return {
			shiftData: this.shift,
			newShiftData: {
				id: this.shift.id,
				date: this.shift.date,
				details: this.shift.details,
				hours: this.shift.hours
			},
		}
	},
	methods: {
		emitCardSelected() { this.$emit('card-selected', this.shiftData.id, this.$refs[this.refName]) },
		deleteCard() { store.commit('toggleDeleteModal') },
		toggleEdit() {
			if (this.editMode && this.isSelected) {
				this.$emit('toggle-edit', -1)
			} else {
				this.$emit('toggle-edit', this.shiftData.id)
			}
		},
		saveEdit() { this.$emit('save-edit', this.newShiftData) },
		cancelEditCard() { this.$emit('cancel-edit', this.shiftData.id) },
	},
	computed: {
		refName() { return `item${this.shift.id}` },
		isSelected() { return this.selectedCardId == this.shiftData.id ? true : false },
		editMode() { return this.editCardId == this.shiftData.id && this.isSelected ? true : false }
	},
	filters: {
		dayDate(inputDate) {
			const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
			const newDate = new Date(inputDate)
			const day = days[newDate.getDay()];
			const date = newDate.getDate();
			const fDate = `${date} ${day}`;
			return fDate;
		},
		month(inputDate) {
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ]
			const newDate = new Date(inputDate)
			const mo = months[newDate.getMonth()];
			const fDate = `${mo}`;
			return fDate;
		}
	}
});

//	!! CardView

const CardView = Vue.component('card-view', {
	name: 'card-view',
	template: '#card-view',
	props: {},
	data() {
		return {
			searchInput: '',
			editCardId: -1,
			deleteIdArray: [],
		}
	},
	methods: {
		handleSelectedCard(cardId, cardRef) {
			cardRef.scrollIntoView(true)
			store.commit('setSelectedCardId', cardId)
		},
		setEditCardId(cardId) { this.editCardId = this.editCardId === cardId ? -1 : cardId },
		saveCardEdit(newData) {
			newData.id === this.editCardId ?
				store.commit('saveCardEdit', newData) :
				null;
			this.editCardId = -1;
		},
		cancelCardEdit() { this.editCardId = -1 },
		handleDeleteCard(cardId) {
			this.deleteIdArray.push(cardId)
			store.commit('deleteCard')
		}
	},
	computed: {
		cardViewElement() { return this.$refs.cardView },
		workHistory() { return store.getters.workHistory },
		selectedCardId() { return store.getters.selectedCardId },
		filteredWorkData() {
			const sortedShifts = this.workHistory
				.sort((a, b) => {
					const aDate = new Date(a.date)
					const bDate = new Date(b.date)
					return bDate.getMonth() - aDate.getMonth() == 0 ?
						bDate.getDate() - aDate.getDate() :
						bDate.getMonth() - aDate.getMonth();
				});

			if (!this.searchInput) return sortedShifts;
	
			const filterVal = dayjs(this.searchInput).format('MM/DD/YYYY');
			const filteredShifts = sortedShifts.filter(shift => filterVal === dayjs(shift.date).format('MM/DD/YYYY'));
			return filteredShifts
		}
	},
	watch: {
		editCardId(newId, oldId) {},
		selectedCardId(newId, oldId) { this.editCardId = newId !== oldId ? -1 : newId },
		filteredWorkData(val) {},
	},
	mounted() {}
});

const router = new VueRouter({
	routes: [
		{ path: '/', component: CardView, name: 'card-view', props: true },
		{ path: '/add-shift-view', component: AddShiftView, name: 'add-shift-view', props: true },
	]
});

const store = new Vuex.Store(storeObj)
const EventBus = new Vue();

const app = new Vue({
	router: router,
	data() {
		return {
			workData: workHistory,
			showNav: false,
		}
	},
	computed: {
		workHistory() { return store.getters.workHistory },
		showDeleteModal() { return store.getters.showDeleteModal }
	},

	watch: {
		workHistory() {}
	},
	methods: {
		handleExportAsJson() { exportAsJson(this.workHistory) },
		handleExportAsCsv() { exportAsCsv(this.workHistory) },
		listenForNavToggle(data) { this.showNav = data },
	},
	created() {
		store.dispatch('fetchLocalStorageData')
	}
}).$mount('#app')


// const ProductEdit = Vue.extend({
// 	template: '#product-edit',
// 	data() {
// 		return {
// 			product: findProduct(this.$route.params.product_id)
// 		}
// 	},
// 	methods: {
// 		updateProduct() {
// 			const product = this.product;

// 			products[findProductKey(product.id)] = {
// 				id: product.id,
// 				name: product.name,
// 				description: product.description,
// 				price: product.price
// 			};
// 			router.push('/');
// 		}
// 	}
// });

// const ProductDelete = Vue.extend({
// 	template: '#product-delete',
// 	data: function() {
// 		return { product: findProduct(this.$route.params.product_id) };
// 	},
// 	methods: {
// 		deleteProduct() {
// 			products.splice(findProductKey(this.$route.params.product_id), 1);
// 			router.push('/');
// 		}
// 	}
// });

// const AddProduct = Vue.extend({
// 	template: '#add-product',
// 	data() {
// 		return {
// 			product: {
// 				name: '',
// 				description: '',
// 				price: ''
// 			}
// 		}
// 	},
// 	methods: {
// 		createProduct() {
// 			let product = this.product;
// 			products.push({
// 				id: Math.random().toString().split('.')[1],
// 				name: product.name,
// 				description: product.description,
// 				price: product.price
// 			});
// 			router.push('/');
// 		}
// 	}
// });