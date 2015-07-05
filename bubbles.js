
(function initialize($canvas, body, requestAnimationFrame) {

	$canvas.width = body.clientWidth;

	// I added this extra height buffer because of are positioning  the canvas absolute, top: -100px.
	// The reason why I did *that* was to deal with the choppy animation happening when the bubbles were going off-screen
	$canvas.height = body.clientHeight + 100;

	var bubbles = [],
		ctx = $canvas.getContext("2d"),
		width = $canvas.width,
		height = $canvas.height,

		upperBound = width / 3,

		colors = ['green', 'yellow', 'red', 'purple', 'blue'],

		colorStopMap = {
			green: ['rgba(0,255,0,1)', 'rgba(0,255,0,9)', 'rgba(0,255,0,0)'],
			yellow: ['rgba(255,255,0,1)', 'rgba(255,255,0,9)', 'rgba(255,255,0,0)'],
			red: ['rgba(255,0,0,1)', 'rgba(255,0,0,9)', 'rgba(255,0,0,0)'],
			purple:  ['rgba(128,0,128,1)', 'rgba(128,0,128,9)', 'rgba(128,0,128,0)'],
			blue:  ['rgba(0,0,255,1)', 'rgba(0,0,255,9)', 'rgba(0,0,255,0)']
		},
		colorStopAmounts = [0, 0.8, 1];

	function generateNewBubble() {

		var colorIndex = ~~(Math.random()* 10) % colors.length,
			color = colors[colorIndex],
			radius = 10 + 100 * Math.random(),
			x = upperBound * Math.random() + radius * 2,
			y = height + radius * 2,
			speed = 1 + 3 * Math.random(),

			bubble = {
				color: color,
				x: x,
				y: y,
				radius: radius,
				speed: speed
			};

		bubbles.push(bubble);
	}

	function drawBubbles() {

		// Reset Canvas
		ctx.clearRect(0,0, width, height);

		// Draw each bubble
		bubbles.forEach(function(bubble, bubbleIndex) {

			// Garbage collect bubbles that disappear above the canvas
			if(bubble.y + bubble.radius < 0) {
				return bubbles.splice(bubbleIndex, 1);
			}

			// Blurry Circle reference: http://stackoverflow.com/questions/5475755/how-to-draw-a-blurry-circle-on-html5-canvas
			var radius = bubble.radius,
				color = bubble.color,
				radgrad = ctx.createRadialGradient(bubble.x,bubble.y,0,bubble.x,bubble.y,radius),
				colorStops = colorStopMap[color];

			colorStopAmounts.forEach(function(value, index) {
				radgrad.addColorStop(value, colorStops[index]);
			});

			// draw shape
			ctx.fillStyle = radgrad;
			ctx.fillRect(bubble.x - radius, bubble.y - radius, bubble.x + radius, bubble.y + radius);

			// Animate the bubble up (for the next time we render)
			bubble.y -= bubble.speed;
		});
		requestAnimationFrame(drawBubbles);
	}

	// Every second create a new bubble
	setInterval(generateNewBubble, 1000);

	// Every animation frame re-draw the canvas
	requestAnimationFrame(drawBubbles);

})(document.getElementById('bubbles'), document.body, window.requestAnimationFrame);