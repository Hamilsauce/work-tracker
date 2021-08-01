import { HamRouter, ActiveRoute } from './ham-router.js';

const contentViews = document.querySelectorAll('.content-view');
const contentEl = document.querySelectorAll('.content');
const viewButtons = document.querySelectorAll('.view-button');
// const viewButtons = [...document.querySelectorAll('.view-button')];
const app = document.querySelector('.app');
const routerViewElement = document.querySelector('.router-view');
console.log(routerViewElement);
const paths = {};
let router = null;

const initApp = () => {
	router = new HamRouter(routerViewElement, app, paths, viewButtons);

	// app.addEventListener('routerLinkClicked', e => {
	// 	router.routeChange(e.detail);
	// 	console.log('router in app', router);

	// 	const routeChangeEvent = new CustomEvent('routeChange', { bubbles: true, detail: { poo: 'poo' } });
	// 	e.target.dispatchEvent(routeChangeEvent);
	// });
}

initApp();

viewButtons.forEach(b => {
	console.log(b);
	b.addEventListener('click', e => {
		// const contentName = e.target.dataset.contentName
		console.log('contentName');

		const routeChangeEvent = new CustomEvent('routerLinkClicked', { bubbles: true, detail: { poo: 'poo' } });
		e.target.dispatchEvent(routeChangeEvent);

		console.log('routerLinkClicked', routeChangeEvent);


		// [...contentViews].forEach(v => { v.classList.remove('show') });

		// const view = [...contentViews].find(v => {
		// 	return v.dataset.contentName === contentName;
		// })
		// console.log(view);
		// view.classList.add('show')

	});
});