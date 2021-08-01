export class HamRouter {
	constructor(routerView = null, parentElement = null, paths = [], routerLinks = null) {
		this._parentElement = parentElement;
		this._routerView = routerView;
		this.routerLinks = routerLinks;
		this._paths = new Map(Object.entries(paths));
		this._activeRoute;
		this._routeHistory = [];
		console.log('p el', this.parentElement);
		this.initialize(this.routerView, this.parentElement)
	}

	initialize(routerView, parent) {
		console.log('init');
		if (!parent) console.log('No parent passed to parent for router.');
		
		if (!routerView) {
			if (!document.querySelector('.router-view')) {
				console.log('No parent passed to router.');
				return;

			}
		};

		parent.addEventListener('routerLinkClicked', e => {
			this.routeChange(e.detail);
			// const routeChangeEvent = new CustomEvent('routeChange', { bubbles: true, detail: { poo: 'poo' } });
			// e.target.dispatchEvent(routeChangeEvent);
			this.activeRoute;
		});

		this.routerView.addEventListener('routeChange', this.handleRouteChange);
	};

	appendToNewParent(parent) { if (this.routerView) parent.appendChild(this.routerView) };

	handleRouteChange(event) {
		console.log('got it', event);
		const routePath = event.detail.destinationPath || null;
		const routeData = event.detail.routeData || null;
	}

	routeChange(newRoute) {
		console.log('route change router method', newRoute);
	}

	get routerView() { return this._routerView };
	get paths() { return this._paths };
	get activeRoute() { return this._activeRoute };
	get parentElement() { return this._parentElement };
	get routeHistory() { return this._routeHistory };
}



export class ActiveRoute {
	constructor(destinationPath, data) {
		this._destinationPath = destinationPath;
		this._data = data;
		this._queryParams;
	}

	getData() {}

	initialize() {
		this.routerView.addEventListener('routeChange', handleRouteChange);
	};

	handleRouteChange(event) {
		const routePath = e.detail.destinationPath;
		const routeData = e.detail.routeData;
	};

	get queryParams() { return this._queryParams };
	get data() { return this._data };
	get destinationPath() { return this._destinationPath };
};

{ HamRouter, ActiveRoute }