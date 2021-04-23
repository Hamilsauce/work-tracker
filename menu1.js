import {Nav} from './components/nav.js'

const nav = new Nav(document.querySelector('.nav'), 'sup')
nav.render()
console.log(nav);
const toggleNav = () => {
	// const nav = document.querySelector('.nav');
	// nav.style.width = '250px';
	if (nav.classList.contains('navExpand')) {
		setTimeout(() => {
			nav.classList.toggle('navExpand')
		}, 200)
	} else {
		setTimeout(() => {
			nav.classList.toggle('navExpand')
		}, 200)
	}
}

const closeNav = () => {
	// const nav = document.querySelector('.nav');
	// nav.style.width = '0px';
	nav.classList.toggle('navExpand')
}

const handleCardData = (action, key, cardData) => {
	const store = window.localStorage;
	if (action == 'get') {
		let fetchedData = store.getItem(key)
		return fetchedData
	} else if (action == 'set') {
		store.setItem(key, cardData)
	}
}

//toggle menu, send expand event to nav
document.querySelector('.menu-button')
	.addEventListener('click', e => {
		nav.toggleNav();
	})

document.querySelector('.close-nav')
	.addEventListener('click', e => {
		nav.toggleNav();
		window.navigator.vibrate(1000); // 
	})

// window.navigator.vibrate(1000); // 

document.querySelector('.form-modal-container')
	.addEventListener('click', e => {
		e.preventDefault()
		e.stopPropagation();
	})

document.querySelector('.userform-cancel-button')
	.addEventListener('click', e => {
		e.preventDefault()
		e.stopPropagation();
		let modal = document.querySelector('.form-modal-container')
		modal.classList.add('hide')
	})

document.querySelector('.userform-submit-button')
	.addEventListener('click', e => {
		e.preventDefault()
		e.stopPropagation();

		let name = document.querySelector('.author-name-input').value
		let date = document.querySelector('.date-input').value
		let header = document.querySelector('.header-input').value
		let content = document.querySelector('.content-input').value
		let app = document.querySelector('.app')

		let appMarkup = app.innerHTML
		let newCard = `
			<div class="card">
					<div class="card-date">${header}</div>
					<div class="card-hours">
						<div class="card-date-container">${date}</div>
						<div class="card-author-container">${name}</div>
					</div>
					<div class="card-details">${content}</div>
				</div>
				</div>
		`;
		let newAppHtml = newCard.concat(appMarkup)
		app.innerHTML = newAppHtml
		handleCardData('set', 'cardData', newAppHtml)

		let modal = document.querySelector('.form-modal-container')
		modal.classList.add('hide')
	})

document.querySelector('.new-card-link')
	.addEventListener('click', e => {
		// let nav = document.querySelector('.nav')
		// nav.classList.add('hide')
		nav.toggleNav()

		let modal = document.querySelector('.form-modal-container')
		modal.classList.remove('hide')
	})

window.onload = e => {
	let app = document.querySelector('.app')
	let appMarkup = handleCardData('get', 'cardData')
	app.innerHTML = appMarkup

	console.log('page is fully loaded');
};