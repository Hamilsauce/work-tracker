import { Nav } from './components/nav.js'
import { Userform } from './components/userform-modal.js'

const nav = new Nav(document.querySelector('.nav'), 'sup')
nav.render()

const userform = new Userform(document.querySelector('.form-modal-container'))
userform.render()


console.log(userform);

const handleCardData = (action, key, cardData) => {
	const store = window.localStorage;
	if (action == 'get') {
		let fetchedData = store.getItem(key)
		return fetchedData
	} else if (action == 'set') {
		store.setItem(key, cardData)
	}
}

//toggle menu, send expand event to app
document.querySelector('.menu-button')
	.addEventListener('click', e => {
		const toggleNavEvent = new CustomEvent('toggleNav', {
			detail: {},
			bubbles: true
		});
		e.target.dispatchEvent(toggleNavEvent)
	})

document.querySelector('.app')
	.addEventListener('toggleNav', e => {
		console.log('heard');
		nav.toggleNav();
	})

document.querySelector('.app')
	.addEventListener('toggleForm', e => {
		console.log('heard form');
		userform.toggle();
	})
document.querySelector('.app')
	.addEventListener('newShiftCreated', e => {
		console.log('heard form submit');
		console.log(e);

	})

// document.querySelector('.form-modal-container')
// 	.addEventListener('click', e => {
// 		e.preventDefault()
// 		e.stopPropagation();
// 	})

//TODO move to userform mod
// document.querySelector('.userform-cancel-button')
// 	.addEventListener('click', e => {
// 		e.preventDefault()
// 		e.stopPropagation();
// 		let modal = document.querySelector('.form-modal-container')
// 		modal.classList.add('hide')
// 	})

// document.querySelector('.userform-submit-button')
// 	.addEventListener('click', e => {
// 		e.preventDefault()
// 		e.stopPropagation();

// 		let name = document.querySelector('.author-name-input').value
// 		let date = document.querySelector('.date-input').value
// 		let header = document.querySelector('.header-input').value
// 		let content = document.querySelector('.content-input').value
// 		let app = document.querySelector('.app-body')

// 		let appMarkup = app.innerHTML
// 		let newCard = `
// 			<div class="card">
// 					<div class="card-date">${header}</div>
// 					<div class="card-hours">
// 						<div class="card-date-container">${date}</div>
// 						<div class="card-author-container">${name}</div>
// 					</div>
// 					<div class="card-details">${content}</div>
// 				</div>
// 				</div>
// 		`;
// 		let newAppHtml = newCard.concat(appMarkup)
// 		app.innerHTML = newAppHtml
// 		handleCardData('set', 'cardData', newAppHtml)

// 		let modal = document.querySelector('.form-modal-container')
// 		modal.classList.add('hide')
// 	})

document.querySelector('.new-card-link')
	.addEventListener('click', e => {
		// let nav = document.querySelector('.nav')
		// nav.classList.add('hide')
		const toggleFormEvent = new CustomEvent('toggleForm', {
			detail: {},
			bubbles: true
		});
		e.target.dispatchEvent(toggleFormEvent)
		nav.toggleNav()
		// userform.toggle();

		// let modal = document.querySelector('.form-modal-container')
		// modal.classList.remove('hide')
	})

window.onload = e => {
	let app = document.querySelector('.app-body')
	let appMarkup = handleCardData('get', 'cardData')
	app.innerHTML = appMarkup

	console.log('page is fully loaded');
};