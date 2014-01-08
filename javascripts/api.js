var circle;  // "shield" which is called by remove_protection() and protection() 

// Display messages on the stage
function writeMessage(messageLayer, message) {
	/**
	 * messageLayer: the layer to print the message on
	 * message: The message to be printed
	 */
	 messageLayer.clear();
	var canvas = messageLayer.getCanvas();
	var context = canvas.getContext("2d");
	context.font="italic 40pt Calibri";
	context.fillStyle="#FF0000";
	context.fillText(message, 500, 25);  // The position to be displayed on the stage
	//context.fillRect(20,20,150,100);
};
function remove_protection(body){
	shield(body.getX(),body.getY(),layer);
	circle.remove();
}
function create_sheild(body, layer){
	circle = fire(body.getX(), body.getY(), layer);
	circle.remove();
	var circleAnim = new Kinetic.Animation(function(frame){
		circle.setX(body.getX() - 50);
		circle.setY(body.getY() - 50);
	}, layer);
	layer.add(circle);
	circleAnim.start();
};
function protection( layer, body) {
	/**
	 * Create a temporary protection area
	 */
	shield(body.getX(),body.getY(),layer);
	window.setTimeout('create_sheild(body,layer);', 3000);

};
function allDegree() {
	if (i < 36) {
		window.setTimeout("allDegree()", 10);
		createBullet(stage, body, layer, i * 20, bullets);
		i++;
	}
};
function getDistance(x1, y1, x2, y2) {
	/** 
	 * Get the distance between (x1, y1) and (x2, y2)
	 */
	var dx =Math.pow((x1 - x2), 2);
	var dy = Math.pow((y1 - y2), 2);
	var distance = Math.sqrt(dx + dy);
	return distance;
};
function explosion(x, y, layer) {
	/**
	 * Create an explosion at position (x, y)
	 * Animate this explosion at this layer
	 */
	 
	 // Play the explosion sound effect
	var explosionSound = new Audio('audios/explosion1.mp3');
	explosionSound.play();
	
	// Get the animation picture coordinates
	var animations = {};
	animations['walkCycle'] = [];
	for (var i = 0; i <= 256; i = i + 64) {
		for (var j = 0; j <= 256; j = j + 64) {
			animations['walkCycle'].push(
					{
						x: j,
						y: i,
						width: 64,
						height: 64
					}
				);
		}
	}
	// Create the explosion animation objects
	var explosionObj = new Image();
	explosionObj.src = "pictures/explosion.png";  // Get the url
	var blob = new Kinetic.Sprite({
		x: x - 20,
		y: y - 20,
		image: explosionObj,
		animation: 'walkCycle',
		animations: animations,
		frameRate: 40
	});
	layer.add(blob);
	blob.start();

	// After the whole explosion cycle has finished, remove the explosion object
	blob.afterFrame(24, function(){
		blob.remove();
	});
};
function level(x, y, layer) {
	/**
	 * Create a animation when picking up bonus
	 */
	var animations = {};
	animations['walkCycle'] = [];
	var out = 1;
	for (var i = 0; i < 10; i++) {
		if (out == 1) {
			out = 0;
		} else if (out == 0) {
			out = 1;
		}
		animations['walkCycle'].push({
			x: 0,
			y: 0,
			width: 100 * out,
			height: 200 * out
		});
	}
	
	var levelObj = new Image();
	levelObj.src = "pictures/level.png";
	var Level = new Kinetic.Sprite({
		x: x - 50,
		y: y - 20,
		image: levelObj,
		animation: 'walkCycle',
		animations: animations,
		frameRate: 10,
		opacity: 0.5
	});
	layer.add(Level);
	Level.start();
	
	var levelAnim = new Kinetic.Animation(function(frame) {
		Level.setX(body.getX() - 50);
		Level.setY(body.getY() - 20);
	}, layer);
	levelAnim.start();

	Level.afterFrame(9, function(){
		Level.remove();
		levelAnim.stop();
	});
};
function dead(x, y, layer, intervalIDs) {
	/**
	 * Create the dead effect when player plane is dead
	 * At position (x, y)
	 * Displayed at the provided layer
	 */
	var deadSound = new Audio('audios/explosion2.mp3');
	deadSound.play();
	bulletId.stop();
	var animations = {};
	animations['walkCycle'] = [];
	for (var i = 0; i <= 1024; i = i + 128) {
		for (var j = 0; j <= 1024; j = j + 128) {
			animations['walkCycle'].push(
				{
					x: j,
					y: i,
					width: 128,
					height: 128
				}
			);
		}
	}
	var explosionObj = new Image();
	explosionObj.src = "pictures/explosion3.png";
	var blob = new Kinetic.Sprite({
		x: x - 40,
		y: y - 50,
		image: explosionObj,
		animation: 'walkCycle',
		animations: animations,
		frameRate: 25,
	});
	layer.add(blob);
	blob.start();
	for (var i = 0; i < intervalIDs.length; i++) {
		intervalIDs[i].stop();
	}
	// Remove the explosion effect after a full cycle
	blob.afterFrame(35, function(){
		layer.removeChildren();
		var backObj = new Image();
		backObj.src = "pictures/backtomain.jpg";
		var back = new Kinetic.Image({
			x: 0,
			y: 0,
			image: backObj,
			width: 960,
			height: 600
		});
		layer.add(back);
		window.addEventListener('keyup', function(e) {
			switch (e.keyCode) {
				case 13:
					window.location.href = "start-page.html";
					break;
			}
		})
	});
	
};
function fire(x, y, layer) {
	/**
	 * Create a fire animation
	 */
	var animations = {};
	animations['walkCycle'] = [];
	for (var i = 0; i < 5; i++) {
		animations['walkCycle'].push({
			x: 100 * i,
			y: 0,
			width: 100,
			height: 95
		});
	}
	
	var fireObj = new Image();
	fireObj.src = "pictures/fire.png";
	var fire = new Kinetic.Sprite({
		x: x - 50,
		y: y - 50,
		image: fireObj,
		animation: 'walkCycle',
		animations: animations,
		frameRate: 15,
		opacity: 0.5
	});
	layer.add(fire);
	fire.start();
	return fire;
};
function loadImage(x, y, width, height, layer, url, opacity, offset, rotation) {
	/**
	 * Load an image with the provided url
	 * At position (x, y)
	 * With width and height
	 * With Transparency opacity
	 * On the provided layer
	 */
	var imageObj = new Image();
	imageObj.src = url;
	var image = new Kinetic.Image({
		x: x,
		y: y,
		image: imageObj,
		width: width,
		height: height,
		opacity: opacity,
		offset: offset,
		rotationDeg: rotation
	});
	layer.add(image);
	return image;
};
function remove(list, object, animation, i) {
	/**
	 * Remove the object from the list and stop its attached animation
	 */
	 list.splice(i, 1);
	 object.remove();
	 animation.stop();
};
