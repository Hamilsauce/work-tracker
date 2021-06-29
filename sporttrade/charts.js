	const ctx = document.getElementById('chart').getContext('2d');
	const chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['red', 'green', 'blue'],
			datasets: [{
				label: '# of Votes',
				data: [12, 19, 3],
				backgroundColor: ['red', 'green', 'blue'],
				borderColor: ['red', 'green', 'blue'],
				borderWidth: 1
			}]
		},
		options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
	});
	
	const card = document.querySelector('.card')
	const chartContainer = document.querySelector('.chart-container')
	
	card.addEventListener('click', e => {
		chartContainer.classList.toggle('hide')
	})
	