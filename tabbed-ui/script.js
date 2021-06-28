const contentViews = document.querySelectorAll('.content-view');
const contentEl = document.querySelectorAll('.content');
const viewButtons = document.querySelectorAll('.view-button');


[...viewButtons].forEach(b => {
	console.log(b);
	b.addEventListener('click', ({ target }) => {
		const contentName = target.dataset.contentName
		console.log(contentName);

		[...contentViews].forEach(v => { v.classList.remove('show') })

		const view = [...contentViews].find(v => {
			return v.dataset.contentName === contentName
		})
		console.log(view);
		view.classList.add('show')

	})
})