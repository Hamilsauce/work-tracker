import {
	HamRouter,
	ActiveRoute
} from './ham-router.js';

const contentViews = document.querySelectorAll('.content-view');
const contentEl = document.querySelectorAll('.content');
const viewButtons = document.querySelectorAll('.view-button');
const app = document.querySelector('.app');
const routerViewElement = document.querySelector('.router-view');
let routes;
let router;
let activeRoute;




const initApp = () => {
	routes = [{
			path: 'games',
			templateSelector: '#games-view-template',
			name: 'games-view',
			queryParams: ['param1', 'param2', ],
			data: {
				gamesProp: 'wow games prop!',
				gamesProp2: 'wow games prop2!',
			}
		},
		{
			path: 'players',
			templateSelector: '#players-view-template',
			name: 'players-view',
			queryParams: ['param1', 'param2', ],
			data: {
				playersProp: 'wow players prop!',
				playersProp2: 'wow players prop2!',
			}
		},
		{
			path: 'details',
			templateSelector: '#details-view-template',
			name: 'details-view',
			queryParams: ['param1', 'param2', ],
			data: {
				detailsProp: 'wow details prop!',
				detailsProp2: 'wow details prop2!',
			}
		},
		{
			path: 'settings',
			templateSelector: '#settings-view-template',
			name: 'settings-view',
			queryParams: ['param1', 'param2', ],
			data: {
				settingsProp: 'wow settings prop!',
				settingsProp2: 'wow settings prop2!',
			}
		}
	];
	router = new HamRouter(routerViewElement, routes, viewButtons);
	activeRoute = new ActiveRoute(routerViewElement, app, routes, viewButtons);
};
initApp();

// viewButtons.forEach(b => {
// 	console.log(b);
// 	b.addEventListener('click', e => {
// 		const routeLinkEvent = new CustomEvent('routerLinkClicked', {
// 			bubbles: true,
// 			detail: {
// 				router: {
// 					path: b.dataset.routerPath
// 				}
// 			}
// 		});
// 		e.target.dispatchEvent(routeLinkEvent);
// 	});
// });