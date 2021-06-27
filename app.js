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
		deleteCanceled() { store.commit('toggleDeleteModal') },
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
				weekNumber: null,
				createdDate: null,
				modifiedDate: null
			}
		}
	},
	methods: {
		handleFormSubmit(e) {
			e.preventDefault()
			if (this.validateForm()) {
				this.newShift.date = dayjs(this.newShift.date).format('MM/DD/YYYY')
				this.newShift.weekNumber = dayjs(this.newShift.date).week(),
					this.newShift.createdDate = dayjs().format('MM/DD/YYYY');
				this.newShift.modifiedDate = dayjs().format('MM/DD/YYYY');

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
				hours: this.shift.hours,
				// createdDate: this.shift.createdDate,
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
		saveEdit() {
			// this.shift.modifiedDate = dayjs().format('MM/DD/YYYY');
			this.$emit('save-edit', this.newShiftData)

		},
		cancelEditCard() { this.$emit('cancel-edit', this.shiftData.id) },
	},
	computed: {
		refName() { return `item${this.shift.id}` },
		isSelected() { return this.selectedCardId == this.shiftData.id ? true : false },
		editMode() { return this.editCardId == this.shiftData.id && this.isSelected ? true : false },
		shiftSpy() { 
			console.log(this.shift);
			return this.shift
		}
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
			store.commit('setSelectedCardId', cardId)

			setTimeout(() => {
				this.cardListElement.scrollTop = cardRef.offsetTop - 55
				document.documentElement.scrollTop = cardRef.offsetTop - 55
			}, 200)
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
		cardListElement() { return this.$refs.cardList },
		workHistory() {
			console.log(store.getters.workHistory)
			return store.getters.workHistory
		},
		weekGroups() {
			// const workHistory = store.getters.workHistory
			const groupObj = this.workHistory
				// .map(shift => {
				// 	return {
				// 		...shift,
				// 		weekNumber: dayjs(shift.date).week()
				// 	}
				// })
				.reduce((weeks, shift) => {
					// console.log(String(dayjs(shift.date).week()));
					const wNum = String(dayjs(shift.date).week())
					// const wNum = String(shift.weekNumber) || String(dayjs(shift.date).week())
					weeks[wNum] = weeks[wNum] || [];
					weeks[wNum].push({
						...shift,
						weekNumber: Number(wNum)
					})

					weeks[wNum]
						.sort((a, b) => {
							const aDate = new Date(a.date)
							const bDate = new Date(b.date)
							return bDate.getDate() - aDate.getDate();
						});
					// console.log(weeks);
					return weeks
				}, {})

			// console.log(Object.entries(groupObj).map(([num, shifts]) => [Number(num),dayjs(groupObj['26'][0].date).weekday(0).format('MM/DD/YYYY'), shifts]).sort((a, b) => a[0] - b[0]));

			return Object.entries(groupObj).map(([num, shifts]) => [Number(num), dayjs(shifts[0].date).weekday(0).format('MM/DD/YYYY'), shifts]).sort((a, b) => a[0] - b[0]);
		},

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
	},
	mounted() {}
});

const WeekGroup = Vue.component('week-group', {
	name: 'week-group',
	template: '#week-group',
	props: {
		week: Array, 
		weekNumber: Number
	},
	data() {
		return {
			weekString: '',
			editCardId: -1,
			deleteIdArray: [],
		collapsed: false,
			
		}
	},
	methods: {
		collapseWeek() {
			this.collapsed = !this.collapsed
		},
		handleSelectedCard(cardId, cardRef) {
			store.commit('setSelectedCardId', cardId)

			setTimeout(() => {
				this.cardListElement.scrollTop = cardRef.offsetTop - 55
				document.documentElement.scrollTop = cardRef.offsetTop - 55
			}, 200)
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
		workHistory() { return store.getters.workHistory },
		weekGroupElement() { return this.$refs.weekGroup },
		cardListElement() { return this.$refs.cardList },
		selectedCardId() { return store.getters.selectedCardId },
		weekData() {
			console.log(this.week);
			return this.week;
		}
	},
	watch: {
		weekData(val) {
			console.log(val);
		}
		// editCardId(newId, oldId) {},
		// selectedCardId(newId, oldId) { this.editCardId = newId !== oldId ? -1 : newId },
		// filteredWorkData(val) {},
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

	watch: { workHistory() {} },
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