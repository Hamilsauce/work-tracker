export class HamRouter {
	constructor(routerView = null, routes = [], routerLinks = null) {
		this._routerView = routerView;
		this._parentElement = this.routerView.parentElement || null;
		this._routerLinks = routerLinks;
		this._routes = this.createRouteMap(routes);
		this._activeRoute = new ActiveRoute(this.routes.get('games'));
		this._routeHistory = [];

		this.initialize(this.routerView, this.parentElement, this.routerLinks);
	}

	initialize(routerView, parent, routerLinks) {
		if (!parent) console.log('No parent element passed to HamRouter.');

		//* set up router links
		if (!routerLinks) {
			console.log('No link elements passed to HamRouter.');
		} else {
			routerLinks.forEach(b => {
				b.addEventListener('click', e => {
					const routeLinkEvent = new CustomEvent('routerLinkClicked', {
						bubbles: true,
						detail: {
							router: {
								path: b.dataset.routerPath
							}
						}
					});
					e.target.dispatchEvent(routeLinkEvent);
				});
			});
		}

		//* listen for router link clicks on window
		window.addEventListener('routerLinkClicked', e => {
			this.changeRoute(e.detail.router.path);
			console.log(this.routes);
		});

		//* test for router view
		if (!routerView) {
			if (!document.querySelector('.router-view')) {
				console.log('No router view passed to HamRouter and no .router-view found in DOM. Creating route view element');
				this.routerView = document.createElement('div');
				this.routerView.classList.add('router-view');
			} else this.routerView = document.querySelector('.router-view')
		};
	};

	createRouteMap(routeArray) {
		return routeArray
			.reduce((newMap, route) => {
				return newMap.set(route.path, {
					...route,
					template: document.querySelector(route.templateSelector).content.firstElementChild.cloneNode(true)
				}, );
			}, new Map());
	};

	changeRoute(destinationPath) {
		this.routeHistory.push({
			...this.activeRoute
		});
		this.activeRoute.update(this.routes.get(destinationPath))

		while (this.routerView.firstChild) this.routerView.removeChild(this.routerView.firstChild);
		this.routerView.appendChild(this.routes.get(destinationPath).template);

		console.log('hamrouter after chage route', this);
		console.log('activeRoute in router changeRoute()', this.activeRoute);
	};

	appendRouterViewToNewParent(parent) {
		if (this.routerView) parent.appendChild(this.routerView)
	};


	get routerView() {
		return this._routerView;
	};
	set routerView(newValue) {
		this.routerView = newValue;
	};

	get routerLinks() {
		return this._routerLinks;
	};
	set routerLinks(newValue) {
		this.routerLinks = newValue;
	};

	get routes() {
		return this._routes;
	};
	set routes(newValue) {
		this.routes = newValue;
	};

	get activeRoute() {
		return this._activeRoute;
	};
	set activeRoute(newValue) {
		this.activeRoute = newValue;
	};

	get parentElement() {
		return this._parentElement;
	};
	set parentElement(newValue) {
		this.parentElement = newValue;
	};

	get routeHistory() {
		return this._routeHistory;
	};
	set routeHistory(newValue) {
		this.routeHistory = newValue;
	};
};



export class ActiveRoute {
	constructor(route = {
		path: 'games'
	}) {
		// this._path = route.path;
		// this._data = route.data;
		// this._queryParams;
	}

	getData() {};

	update(route) {
		Object.entries(route).forEach(([key, value]) => this[key] = value)
		console.log('updated active route', this);
	};

	// get queryParams() {
	// 	return this._queryParams;
	// };
	// set queryParams(newValue) {
	// 	this.queryParams = newValue;
	// };
	// get data() {
	// 	return this._data;
	// };
	// set data(newValue) {
	// 	this.data = newValue;
	// };
	// get destinationPath() {
	// 	return this._destinationPath;
	// };
	// set destinationPath(newValue) {
	// 	this.destinationPath = newValue;
	// };
};

// export const HamRouter

{
	HamRouter,
	ActiveRoute
}