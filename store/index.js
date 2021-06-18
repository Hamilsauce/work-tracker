// import { workHistory } from '../data/work-data.js'

export default {
	state: {
		workHistory: [],
		selectedCardId: 0,
		backup: [],
		showDeleteModal: false
	},

	mutations: {
		toggleDeleteModal(state) {
			state.showDeleteModal = !state.showDeleteModal;
		},
		addShiftToWorkHistory(state, newShift) {
			if (newShift.date) {
				state.workHistory.push({
					...newShift,
					createdDate: new Date().toDateString(),
					id: state.workHistory.length + 1,
					modifiedDate: null
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
			let oldCard = state.workHistory.find(c => c.id === editedCard.id)
			oldCard.hours = editedCard.hours
			oldCard.details = editedCard.details
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
		showDeleteModal(state) {
			return state.showDeleteModal;
		}
	},

	actions: {
		fetchLocalStorageData(context) {
			const lsData = JSON.parse(localStorage.getItem('workHistory')) || [];
			context.commit('setWorkHistory', lsData)
		},

		storeHistory({ commit, state }, newData) {
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
			})
		}
	}
}