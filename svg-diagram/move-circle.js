let timerFunction = null;

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
	let newX = 2 + parseInt(x);
	if (newX > 500) {
		newX = 20;
	}
	circle.setAttribute("cx", newX);
}