// import { workHistory } from '../data/work-data.js'

export default {
	state: {
		workHistory: [],
		selectedCardId: 0,
		backup: [],
		showDeleteModal: false,
		showNav: false,
		selectedCardScroll: null
	},

	mutations: {
		toggleShowNav(state) {
			// console.log(state);
			state.showNav = !state.showNav;
		},
		toggleDeleteModal(state) {
			console.log(state);
			state.showDeleteModal = !state.showDeleteModal;
		},

		addShiftToWorkHistory(state, newShift) {
			if (newShift.date) {
				state.workHistory.push({
					...newShift,
					createdDate: dayjs().format('MM/DD/YYYY'),
					id: state.workHistory.length + 1,
					modifiedDate: dayjs().format('MM/DD/YYYY'),
					hours: Number(newShift.hours)
				});
				localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
			}
		},

		setWorkHistory(state, lsData) {
			if (!lsData) {
				state.workHistory = workHistory;
			} else {
				state.workHistory = lsData;
			}
		},

		setSelectedCardId(state, id) {
			state.selectedCardId = id;
		},
		setSelectedCardScroll(state, data) {
			state.selectedCardScroll = data;
		},

		deleteCard(state) {
			state.workHistory = state.workHistory
				.filter(item => {
					return item.id !== state.selectedCardId
				})
			localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
		},
		// deleteCard(state, idArray) {
		// 	state.workHistory = state.workHistory
		// 		.filter(item => {
		// 			return !idArray.includes(item.id)
		// 		})
		// 	localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
		// },

		saveCardEdit(state, editedCard) {
			let targetCard = state.workHistory.find(c => c.id === editedCard.id)

			targetCard.hours = editedCard.hours
			targetCard.details = editedCard.details
			targetCard.modifiedDate = dayjs().format('MM/DD/YYYY')

			localStorage.setItem('workHistory', JSON.stringify(state.workHistory))
		},
	},

	getters: {
		workHistory(state) {
			return state.workHistory;
		},

		selectedCardId(state) {
			return state.selectedCardId;
		},
		selectedCardScroll(state) {
			return state.selectedCardScroll;
		},
		showNav(state) {
			return state.showNav;
		},
		showDeleteModal(state) {
			return state.showDeleteModal;
		}
	},

	actions: {
		fetchLocalStorageData(context) {
			const lsData = JSON.parse(localStorage.getItem('workHistory')) || [];
			context.commit('setWorkHistory', lsData)
		},
		handleSelectedCard({
			commit,
			state
		}, {
			cardId,
			cardRef
		}) {
			commit('setSelectedCardScroll', cardRef.offsetTop - 55)
			commit('setSelectedCardId', cardId)
			console.log(state);
		},

		storeHistory({
			commit,
			state
		}, newData) {
			commit('addShiftToWorkHistory', newData)
			state.workHistory
				.sort((a, b) => {
					const aDate = new Date(a.date)
					const bDate = new Date(b.date)
					return bDate.getMonth() - aDate.getMonth() == 0 ?
						bDate.getDate() - aDate.getDate() :
						bDate.getMonth() - aDate.getMonth();
				});
			state.workHistory.forEach((shift, index, arr) => {
				shift.id = arr.length - index
				shift.hours = Number(shift.hours)

			})
		}
	}
}