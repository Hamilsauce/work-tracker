// const canvas = document.querySelector('canvas');
// const ctx = canvas.getContext('2d');

// ctx.fillStyle = 'white';
// ctx.fillRect(20, 20, 100, 100);

// const contentViews = document.querySelectorAll('.content-view');
// const contentEl = document.querySelectorAll('.content');
const optionButtons = document.querySelectorAll('.option');
const menuButton = document.querySelector('.header-menu-button');
const nav = document.querySelector('.app-nav');
const navClose = document.querySelector('.close-nav');
const activeOption = null;

menuButton
	.addEventListener('click', ({ target }) => {
		console.log('click');
	nav.classList.add('.navExpand')
	});
navClose
	.addEventListener('click', ({ target }) => {
	nav.classList.remove('.navExpand')
	});

[...optionButtons].forEach(b => {
	// console.log(b);
	b.addEventListener('click', ({ target }) => {
		console.log(target);
		[...optionButtons].forEach(_ =>  _.classList.remove('active-option') )
		target.classList.add('active-option')

		// const option = target.dataset.contentName
		// const contentName = target.dataset.contentName
		// console.log(contentName);

		// [...contentViews].forEach(v => { v.classList.remove('show') })

		// const view = [...contentViews].find(v => {
		// 	return v.dataset.contentName === contentName
		// })
		// console.log(view);

	})
})