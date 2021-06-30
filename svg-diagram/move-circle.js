let timerFunction = null;
let rowHeight = 20;

const startAnimation = () => {
	if (timerFunction == null) {
		timerFunction = setInterval(animate, 20);
	}
}

const stopAnimation = () => {
	if (timerFunction != null) {
		clearInterval(timerFunction);
		timerFunction = null;
	}
}

const animate = () => {
	let circle = document.getElementById("circle1");
	let x = circle.getAttribute("cx");
	let newX = 4 + parseInt(x);
	if (rowHeight > 100) {
		rowHeight = 20
	}

	if (newX > 360) {
		newX = 20;
		rowHeight += 20;
	}

	circle.setAttribute("cy", rowHeight);
	circle.setAttribute("cx", newX);
}
let clicks = 0;

document.addEventListener('mousedown', function(e) {
	if (!e.target.closest('#svg')) return;
	console.log(e.target.id);
	if (e.target.id === 'svg') {
		let newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		newRect.setAttribute("x", e.clientX);
		newRect.setAttribute("y", e.clientY);
		newRect.setAttribute("width", "2");
		newRect.setAttribute("height", "2");
		newRect.setAttribute("fill", "#5cceee");
		e.target.appendChild(newRect)
	}

}, false);
document.addEventListener('mousemove', function(e) {
	if (!e.target.closest('#svg')) return;
	console.log(e);
	if (e.target.id === 'svg') {
		let newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		newRect.setAttribute("x", e.clientX);
		newRect.setAttribute("y", e.clientY);
		newRect.setAttribute("width", "200");
		newRect.setAttribute("height", "200");
		newRect.setAttribute("fill", "#5cceee");
		newRect.addEventListener('click', function(e) {
			if (clicks > 5) {
				newRect.setAttribute("width", "200");
				newRect.setAttribute("height", "200");
				let w = `${Number(newRect.getAttribute("width")) + 20}`;
				let h = `${Number(newRect.getAttribute("height")) + 20}`;
				// let h = Number(newRect.getAttribute("height")) + 20;
console.log(w,h);
				newRect.setAttribute("width", w)
				newRect.setAttribute("height", h);

			}
			else {
			}
			e.target.appendChild(newRect)

		}, false);
	}
})


// svg.addEventListener('click', e => {
// 	console.log(e);
// 	console.log(e.target);

// })