import storeObj from './store/index.js'
import {
	workHistory
} from './data/work-data.js'
import {
	exportAsJson,
	exportAsCsv
} from './services/fileSaver.js'


const DeleteCardModal = Vue.component('delete-card-modal', {
	template: '#delete-card-modal',
	methods: {
		deleteConfirmed() {
			store.commit('deleteCard');
			store.commit('toggleDeleteModal')
		},
		deleteCanceled() {
			store.commit('toggleDeleteModal')
		},
	},
});


// TODO - FIX NAV not closing after X clicked, and not auto closing when route to add shift
const AppNav = Vue.component('app-nav', {
	template: '#app-nav',
	props: {},
	computed: {
		showNav() {
			return store.getters.showNav
		}
	},
	methods: {
		closeNav() {
			setTimeout(() => {
				store.commit('toggleShowNav')
			}, 200)
		},
		exportJsonClicked() {
			this.$emit('export-json')
		},
		exportCsvClicked() {
			this.$emit('export-csv')
		}
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
		handleMenuClick() {
			store.commit('toggleShowNav')
		}
	}
});

const ModalDimmer = Vue.component('modal-dimmer', {
	template: '#modal-dimmer',
	props: {},
	data() {
		return {}
	},
	computed: {
		showNav() {
			return store.getters.showNav
		},
		showDimmer() {
			return this.showNav === true || store.getters.showDeleteModal === true ? true : false;
		},
	},
	watch: {
		showDimmer() {}
	},
	methods: {
		handleDimmerClick() {
			if (this.showNav) {
				store.commit('toggleShowNav')
			} else if (store.getters.showDeleteModal) {
				store.commit('toggleDeleteModal')
			}
		}
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
				this.newShift.weekNumber = dayjs(this.newShift.date).week();
				this.newShift.createdDate = dayjs().format('MM/DD/YYYY');
				this.newShift.modifiedDate = dayjs().format('MM/DD/YYYY');

				store.dispatch('storeHistory', this.newShift)
				router.push('/')
			}
		},
		handleFormCancel() {
			router.push('/')
		},
		validateForm() {
			return !this.newShift.date || !this.newShift.hours ? false : true
		}
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
			},
		}
	},
	methods: {
		emitCardSelected() {
			store.dispatch('handleSelectedCard', {
				cardId: this.shiftData.id,
				cardRef: this.cardRef
			})
		},
		deleteCard() {
			store.commit('toggleDeleteModal')
		},
		toggleEdit() {
			this.editMode && this.isSelected ? this.$emit('toggle-edit', this.shift.id) : this.$emit('toggle-edit', this.shiftData.id);
		},
		saveEdit() {
			store.commit('saveCardEdit', this.newShiftData);

			this.toggleEdit()

			// this.$emit('save-edit', this.newShiftData)
		},
		cancelEditCard() {
			this.$emit('cancel-edit', this.shiftData.id)
		},
	},
	computed: {
		refName() {
			return `item${this.shift.id}`
		},
		cardRef() {
			return this.$refs[this.refName]
		},
		isSelected() {
			return this.selectedCardId == this.shiftData.id ? true : false
		},
		editMode() {
			return this.editCardId == this.shiftData.id && this.isSelected ? true : false
		},
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
		// setEditCardId(cardId) {
		// 	this.editCardId = this.editCardId === cardId ? -1 : cardId
		// },
		// saveCardEdit(newData) {
		// 	newData.id === this.editCardId ?
		// 		store.commit('saveCardEdit', newData) :
		// 		null;
		// 	this.editCardId = -1;
		// },
		// cancelCardEdit() {
		// 	this.editCardId = -1
		// },
		// handleDeleteCard(cardId) {
		// 	this.deleteIdArray.push(cardId)
		// 	store.commit('deleteCard')
		// }
	},
	computed: {
		selectedCardId() {
			return store.getters.selectedCardId
		},
		selectedCardScroll() {
			return store.getters.selectedCardScroll
		},
		cardViewElement() {
			return this.$refs.cardView
		},
		cardListElement() {
			return this.$refs.cardList
		},
		workHistory() {
			return store.getters.workHistory
		},
		weekGroups() {
			const groupObj = this.workHistory
				.reduce((weeks, shift) => {
					// group shifts by week number, by creating or updating object props
					const weekNum = String(dayjs(shift.date).week())
					// create prop array if doesnt exist
					weeks[weekNum] = weeks[weekNum] || [];
					// push new week to array
					weeks[weekNum].push({
						...shift,
						weekNumber: Number(weekNum)
					})

					weeks[weekNum]
						.sort((a, b) => {
							const aDate = new Date(a.date)
							const bDate = new Date(b.date)
							return bDate.getDate() - aDate.getDate();
						});
					return weeks
				}, {})

			return Object.entries(groupObj).map(([num, shifts]) => [Number(num), dayjs(shifts[0].date).weekday(0).format('MM/DD/YYYY'), shifts]).sort((a, b) => a[0] - b[0]);
		},

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
		selectedCardId(newId, oldId) {
			this.editCardId = newId !== oldId ? -1 : newId
		},
		selectedCardScroll() {
			setTimeout(() => {
				this.cardListElement.scrollTop = store.getters.selectedCardScroll
				document.documentElement.scrollTop = store.getters.selectedCardScroll
			}, 100)
		}
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
			collapse: false,
			showChart: false
		}
	},
	methods: {
		toggleChart() {
			this.showChart = !this.showChart;
		},

		getTotals() {
			const totalHours = this.week.reduce((sum, curr) => {
				return sum = sum + Number(curr.hours)
			}, 0);

			this.totals2 = {
				payRate: 35,
				days: this.week.length,
				hours: this.week.reduce((sum, curr) => {
					return sum = sum + Number(curr.hours)
				}, 0),
				earnings: Intl.NumberFormat('en-US').format(totalHours * 35)
			}
		},

		collapseWeek() {
			this.collapse = !this.collapse
		},
		setEditCardId(cardId) {
			this.editCardId = this.editCardId === cardId ? -1 : cardId
		},
		saveCardEdit(newData) {
			newData.id === this.editCardId ?
				store.commit('saveCardEdit', newData) :
				null;
			this.editCardId = -1;
		},
		cancelCardEdit() {
			this.editCardId = -1
		},
		handleDeleteCard(cardId) {
			this.deleteIdArray.push(cardId)
			store.commit('deleteCard')
		}
	},

	computed: {

		workHistory() {
			return store.getters.workHistory
		},
		weekGroupElement() {
			return this.$refs.weekGroup
		},
		selectedCardId() {
			return store.getters.selectedCardId
		},
		totals() {
			const totalHours = this.week.reduce((sum, curr) => {
				return sum = sum + Number(curr.hours)
			}, 0);

			return {
				payRate: 35,
				days: this.week.length,
				hours: this.week.reduce((sum, curr) => {
					return sum = sum + Number(curr.hours)
				}, 0),
				earnings: Intl.NumberFormat('en-US').format(totalHours * 35)
			}
		}
	},
	watch: {
		week() {

		}
	},
	mounted() {
		// console.log('week');
		// console.log(this.week);
		// console.log(this.totals);

	}
});

const ChartOverlay = Vue.component('chart-overlay', {
	name: 'chart-overlay',
	template: '#chart-overlay',
	props: {
		wTotals: Object,
		weekNumber: Number,
		week: Array

	},
	data() {
		return {
			elem: this.$refs.chart
		}
	},
	computed: {
		canvasElement() {
			return this.$refs.chart;
		},
		weekId() {},
		totals() {
			const totalHours = this.week.reduce((sum, curr) => {
				return sum = sum + Number(curr.hours)
			}, 0);
			return {
				weekNumber: this.weekNumber,
				payRate: 35,
				data: {
					days: this.week.length,
					hours: this.week.reduce((sum, curr) => {
						return sum = sum + Number(curr.hours)
					}, 0),
					earnings: Intl.NumberFormat('en-US').format(totalHours * 35)
				}
			}
		},
		hoursPerDay() {
			return this.week.map(day => [day.date, day.hours])
		}
	},
	watch: {

	},
	methods: {
		chart(chartType = 'bar') {
			console.log('chart');
			const labels = Object.keys(this.totals.data).map(_ => `${_[0].toUpperCase()}${_.slice(1)}`)
			console.log(labels);
			// const [dayDates, dayHours]
			// console.log(	this.canvasElement);
			const ctx = this.canvasElement.getContext('2d');
			const chart = new Chart(ctx, {
				type: 'pie',
				data: {
					labels: this.hoursPerDay.map(_ => `${_[0]} Hours`),
					// labels: labels,
					datasets: [{
						label: 'Totals',
						data: this.hoursPerDay.map(_ => _[1]),
						// data: Object.values(this.totals.data),
						backgroundColor: ['red', 'green', 'blue'],
						borderColor: ['red', 'green', 'blue'],
						borderWidth: 1
					}]
				},
				// options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
				options: {
					legend: {
						position: 'left'
					}
				}
				
			});
		}
	},
	created() {

	},
	mounted() {
		// console.log('chart mount');
		console.log('totes', this.totals);
		this.chart();
	}
});


const router = new VueRouter({
	routes: [{
			path: '/',
			component: CardView,
			name: 'card-view',
			props: true
		},
		{
			path: '/add-shift-view',
			component: AddShiftView,
			name: 'add-shift-view',
			props: true
		},
	]
});

const store = new Vuex.Store(storeObj)
const EventBus = new Vue();

const app = new Vue({
	router: router,
	data() {
		return {
			workData: workHistory,
		}
	},
	computed: {
		workHistory() {
			return store.getters.workHistory
		},
		showNav() {
			return store.getters.showNav
		},
		showDeleteModal() {
			return store.getters.showDeleteModal
		}
	},

	watch: {
		workHistory() {}
	},
	methods: {
		handleExportAsJson() {
			exportAsJson(this.workHistory)
		},
		handleExportAsCsv() {
			exportAsCsv(this.workHistory)
		},
	},
	created() {
		store.dispatch('fetchLocalStorageData')
	}
}).$mount('#app')





// !! SCRATCH
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


const products = [{
		id: 1,
		name: 'Angular',
		description: 'Superheroic JavaScript MVW Framework.',
		price: 100
	},
	{
		id: 2,
		name: 'Ember',
		description: 'A framework for creating ambitious web applications.',
		price: 100
	},
	{
		id: 3,
		name: 'React',
		description: 'A JavaScript Library for building user interfaces.',
		price: 100
	}
];

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