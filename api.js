// Display messages on the stage
function writeMessage(messageLayer, message) {
	/**
	 * messageLayer: the layer to print the message on
	 * message: The message to be printed
	 */
	messageLayer.moveToTop();
	var context = messageLayer.getContext();
	messageLayer.clear();
	context.font = '10pt Calibri';
	context.fillStyle = 'yellow';
	context.fillText(message, 500, 25);  // The position to be displayed on the stage
};

function createBullet(body, layer, angle, bullets) {
	/** 
	 * Create the bullet at the head of the player plane, specifically body
	 * layer: bullet to be added to this layer
	 * angle: shooting angle when the bullet is created
	 * bullets: a list to track all the bullets
	 */ 
	var shotSound = new Audio('audios/gunshot.mp3');
	shotSound.play();
	var bx = 8 * Math.cos(angle * Math.PI / 180);
	var by = 8 * Math.sin(angle * Math.PI / 180);
	
	// Load the bullet image
	var bullet = loadImage(body.getX() - 5, body.getY() - 40, 12, 25, layer, "pictures/bullet.png", 1, [0, 0], angle + 90);
	
	// Create the bullet animation
	var animBullet = new Kinetic.Animation(function(frame) {
		bullet.setX(bullet.getX() + bx);
		bullet.setY( bullet.getY() + by);
	});
	animBullet.start();  // Start the animation
	// Add the bullet and its animation to a list
	var bulletPair = [];
	bulletPair.push(bullet);
	bulletPair.push(animBullet);
	bullets.push(bulletPair);
};

function enemyBullet(body, enemy, layer, angle) {
	/**
	 * Function for the enemy plane to shoot bullets
	 * body: track the coordinate of the player
	 * enemy: The bullet is created at the center of this enemy
	 * layer: the bullet is to be added to this layer
	 * angle: The angle to be shooted
	 */
	// Bullet from enemy
	// Get the shooting angle
	var bx = 6 * Math.cos(angle * Math.PI / 180);
	var by = 6 * Math.sin(angle * Math.PI / 180);
	
	// Create the bullet object	
	var bullet = loadImage(enemy.getX(), enemy.getY(), 12, 25, layer, "pictures/bullet2.png", 1, [0, 0], angle + 90);

	var animBullet = new Kinetic.Animation(function(frame) {
		bullet.setX(bullet.getX() + bx);
		bullet.setY( bullet.getY() + by);
		
		// Check collision with the player plane
		var distance = getDistance(bullet.getX(), bullet.getY(), body.getX(), body.getY());
		if (distance <= 30) {
			// The player lose the game, remove the player plane and the bullet, stop animation
			body.remove();
			bullet.remove();
			this.stop();
			dead(body.getX(), body.getY(), layer);

		}
		// Check boundary, once hit the bound, remove the bullet and stop the animation
		if (bullet.getY() <= 5 || bullet.getY() >= stage.getAttr("height") - 50 || bullet.getX() <= 50 || bullet.getX() >= stage.getAttr("width") - 50) {
			bullet.remove();
			this.stop();
		}
	});
	animBullet.start();
};


function allDegree() {
	if (i < 36) {
		window.setTimeout("allDegree()", 10);
		createBullet(body, layer, i * 20, bullets);
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
	var animations = {
		walkCycle: [{
			x: 0,
			y: 0,
			width: 64,
			height: 64
		}, {
			x: 64,
			y: 0,
			width: 64,
			height: 64
		}, {
			x: 128,
			y: 0,
			width: 64,
			height: 64
		}, {
			x: 192,
			y: 0,
			width: 64,
			height: 64
		}, {
			x: 256,
			y: 0,
			width: 64,
			height: 64
		}, {
			x: 0,
			y: 64,
			width: 64,
			height: 64
		}, {
			x: 64,
			y: 64,
			width: 64,
			height: 64
		}, {
			x: 128,
			y: 64,
			width: 64,
			height: 64
		}, {
			x: 192,
			y: 64,
			width: 64,
			height: 64
		}, {
			x: 256,
			y: 64,
			width: 64,
			height: 64
		}, {
			x: 0,
			y: 128,
			width: 64,
			height: 64
		}, {
			x: 64,
			y: 128,
			width: 64,
			height: 64
		}, {
			x: 128,
			y: 128,
			width: 64,
			height: 64
		}, {
			x: 192,
			y: 128,
			width: 64,
			height: 64
		}, {
			x: 256,
			y: 128,
			width: 64,
			height: 64
		}, {
			x: 0,
			y: 192,
			width: 64,
			height: 64
		}, {
			x: 64,
			y: 192,
			width: 64,
			height: 64
		}, {
			x: 128,
			y: 192,
			width: 64,
			height: 64
		}, {
			x: 192,
			y: 192,
			width: 64,
			height: 64
		}, {
			x: 256,
			y: 192,
			width: 64,
			height: 64
		}, {
			x: 0,
			y: 256,
			width: 64,
			height: 64
		}, {
			x: 64,
			y: 256,
			width: 64,
			height: 64
		}, {
			x: 128,
			y: 256,
			width: 64,
			height: 64
		}, {
			x: 192,
			y: 256,
			width: 64,
			height: 64
		}, {
			x: 256,
			y: 256,
			width: 64,
			height: 64
		}]
	};
	
	// Create the explosion animation objects
	var explosionObj = new Image();
	explosionObj.src = "pictures/explosion.png";  // Get the url
	var blob = new Kinetic.Sprite({
		x: x - 20,
		y: y - 20,
		image: explosionObj,
		animation: 'walkCycle',
		animations: animations,
		frameRate: 40,
	});
	layer.add(blob);
	blob.start();
	
	// After the whole explosion cycle has finished, remove the explosion object
	blob.afterFrame(24, function(){
		blob.remove();
	});
};

function dead(x, y, layer) {
	/**
	 * Create the dead effect when player plane is dead
	 * At position (x, y)
	 * Displayed at the provided layer
	 */
	var deadSound = new Audio('audios/explosion2.mp3');
	deadSound.play();
	clearInterval(bulletId);
	var animations = {
		walkCycle: [{
			x: 0,
			y: 0,
			width: 128,
			height: 128
		},  {
			x: 256,
			y: 0,
			width: 128,
			height: 128
		},  {
			x: 512,
			y: 0,
			width: 128,
			height: 128
		},  {
			x: 768,
			y: 0,
			width: 128,
			height: 128
		},  {
			x: 1024,
			y: 0,
			width: 128,
			height: 128
		}, {
			x: 0,
			y: 128,
			width: 128,
			height: 128
		},  {
			x: 256,
			y: 128,
			width: 128,
			height: 128
		}, {
			x: 384,
			y: 128,
			width: 128,
			height: 128
		}, {
			x: 512,
			y: 128,
			width: 128,
			height: 128
		}, {
			x: 640,
			y: 128,
			width: 128,
			height: 128
		}, {
			x: 768,
			y: 128,
			width: 128,
			height: 128
		}, {
			x: 896,
			y: 128,
			width: 128,
			height: 128
		}, {
			x: 1024,
			y: 128,
			width: 128,
			height: 128
		}, {
			x: 0,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 128,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 256,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 384,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 512,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 640,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 768,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 896,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 1024,
			y: 256,
			width: 128,
			height: 128
		}, {
			x: 0,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 128,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 256,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 384,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 512,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 640,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 768,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 896,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 1024,
			y: 384,
			width: 128,
			height: 128
		}, {
			x: 0,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 128,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 256,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 384,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 512,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 640,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 768,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 896,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 1024,
			y: 512,
			width: 128,
			height: 128
		}, {
			x: 0,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 128,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 256,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 384,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 512,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 640,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 768,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 896,
			y: 640,
			width: 128,
			height: 128
		}, {
			x: 1024,
			y: 640,
			width: 128,
			height: 128
		}]
	};
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
	
	// Remove the explosion effect after a full cycle
	blob.afterFrame(35, function(){
		blob.remove();
		window.location.href = "end-page.html";
	});
};


function protection(layer) {
	/**
	 * Create a temporary protection area
	 */
	var circle = new Kinetic.Circle({
		x: body.getX(),
		y: body.getY(),
		radius: 100,
		fill: 'red',
		opacity: 0.5
	});
	layer.add(circle);
	protectPlayer = true;
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


function enermy(layer, enemies, bullets, body) {
	// Function for displaying enemy planes

	// Get a random position for the plane
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets
	
	// Create an enemy variable with random position
	var enemy = loadImage(px, py, 30, 40, layer, "pictures/enemy1.png", 1, [15, 20], 180);
	enemies.push(enemy);  // Add the enemy to the enemies list

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf(enemy));
		}
		
		// Make the bomb based on the random position generated
		if (enemy.getY() == bulletY) {
			var angle;
			for (angle = 0; angle <= 5; angle++) {
				enemyBullet(body, enemy, layer, angle * 60);
			}
		}
		// Define the collision logic here
		
		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 50) {
			// The player is dead
			body.remove();
			remove(enemies, enemy, this, enemies.indexOf(enemy));  // Remove the enemy plane
			explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
			dead(body.getX(), body.getY(), layer);
		}

		for (var i = 0; i < bullets.length; i++) {
			// Get coordinate and distance between bullets and this enemy
			var distance2 = getDistance(enemy.getX(), enemy.getY(), bullets[i][0].getX(), bullets[i][0].getY());
			if (distance2 <= 30) {
				// Enemy hit by bullets, remove enemy and stop the animation
				explosion(enemy.getX(), enemy.getY(), layer);
				remove(bullets, bullets[i][0], bullets[i][1], i);
				remove(enemies, enemy, this, enemies.indexOf(enemy));
				points += 1;
				writeMessage(messageLayer, points);
			} else if (bullets[i][0].getY() <= 5 || bullets[i][0].getY() >= stage.getAttr("height") - 50 || bullets[i][0].getX() <= 50 || bullets[i][0].getX() >= stage.getAttr("width") - 50) {
				// If the bullet hit the bound, remove the bullet and stop its animation
				remove(bullets, bullets[i][0], bullets[i][1], i);
			} 
		}
		enemy.setY(enemy.getY() + 4);
	}, layer);
	enemyAnim.start();
	enemiesAnim.push(enemyAnim);
};

