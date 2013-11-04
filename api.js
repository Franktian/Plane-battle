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
function remove_protection(){
	circle.remove();
	this.stop();
}
function protection( layer, body, bullets, enemies,protect_on_off) {
	/**
	 * Create a temporary protection area
	 */
	 circle = new Kinetic.Circle({
			x: body.getX(),
			y: body.getY(),
			radius: 100,
			fill: 'red',
			opacity: 0.5,
		});
		var circleAnim = new Kinetic.Animation(function(frame){
			circle.setX(body.getX());
			circle.setY(body.getY());
	
			for (var i = 0; i < enemies.length; i++) {
				var distance1 = getDistance(circle.getX(), circle.getY(), enemies[i][0].getX(), enemies[i][0].getY());
				if (distance1 <= 100) {
					explosion(enemies[i][0].getX(), enemies[i][0].getY(), layer);
					remove(enemies, enemies[i][0], enemies[i][1], i);
				}
			}
	
			for (var j = 0; j < bullets.length; j++) {
				var distance2 = getDistance(circle.getX(), circle.getY(), bullets[j][0].getX(), bullets[j][0].getY());
				if (distance2 <= 100) {
					explosion(bullets[j][0].getX(), bullets[j][0].getY(), layer);
					remove(bullets, bullets[j][0], bullets[j][1], j);
				}
			}
		}, layer);
		layer.add(circle);
		circleAnim.start();
		
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
	var bullet = loadImage(body.getX() - 5, body.getY() - 40, 8, 15, layer, "pictures/bullet.png", 1, [0, 0], angle + 90);
	
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

function enemyBullet(body, enemy, layer, angle, enemyBullets, healthBar, protect) {
	/**
	 * Function for the enemy plane to shoot bullets
	 * body: track the coordinate of the player
	 * enemy: The bullet is created at the center of this enemy
	 * layer: the bullet is to be added to this layer
	 * angle: The angle to be shooted
	 */
	// Bullet from enemy
	// Get the shooting angle
	var bx = 8 * Math.cos(angle * Math.PI / 180);
	var by = 8 * Math.sin(angle * Math.PI / 180);
	
	// Create the bullet object	
	var bullet = loadImage(enemy.getX(), enemy.getY(), 8, 15, layer, "pictures/bullet2.png", 1, [0, 0], angle + 90);

	var animBullet = new Kinetic.Animation(function(frame) {
		bullet.setX(bullet.getX() + bx);
		bullet.setY( bullet.getY() + by);
		
		// Check collision with the player plane
		var distance = getDistance(bullet.getX(), bullet.getY(), body.getX(), body.getY());
		if (distance <= 30 && !protect) {
			// The player lose the game, remove the player plane and the bullet, stop animation			
			if (healthBar.getWidth("width") > 30) {
				remove(enemyBullets, bullet, this, enemyBullets.indexOf([bullet, this]));
				explosion(bullet.getX(), bullet.getY(), layer);  // Display the explosion animation
				healthBar.setWidth(healthBar.getWidth() - 50);
				switch (healthBar.getWidth()) {
					case 130:
						healthBar.setFill("yellow");
						break;
					case 80:
						healthBar.setFill("orange");
						break;
					case 30:
						healthBar.setFill("red");
						break;
				}
			} else {
				healthBar.setWidth(healthBar.getWidth() - 30);
				explosion(bullet.getX(), bullet.getY(), layer);  // Display the explosion animation
				remove(enemyBullets, bullet, this, enemyBullets.indexOf([bullet, this]));
				dead(body.getX(), body.getY(), layer);
			}

		}
		// Check boundary, once hit the bound, remove the bullet and stop the animation
		if (bullet.getY() <= 5 || bullet.getY() >= stage.getAttr("height") - 50 || bullet.getX() <= 50 || bullet.getX() >= stage.getAttr("width") - 50) {
			remove(enemyBullets, bullet, this, enemyBullets.indexOf([bullet, this]));
		}
	});
	animBullet.start();

	var bulletPair = [];
	bulletPair.push(bullet);
	bulletPair.push(animBullet);
	enemyBullets.push(bulletPair);
};

function enemyForwardBullet(layer, enemies, bullets, body, enemyBullets, healthBar,protect) {
	/**
	 *	Create a basic enemy plane
	 */
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets

	var enemy = loadImage(px, py, 30, 40, layer, "pictures/enemy1.png", 1, [15, 20], 180);
	var bulletInt = setInterval(function(){
		enemyBullet(body, enemy, layer, 90, enemyBullets, healthBar, protect);
	}, 800);

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
			clearInterval(bulletInt);
		}

		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 50 && !protect) {
			// The player is dead
			if (healthBar.getWidth("width") > 30) {
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				healthBar.setWidth(healthBar.getWidth() - 50);
				switch (healthBar.getWidth()) {
					case 130:
						healthBar.setFill("yellow");
						break;
					case 80:
						healthBar.setFill("orange");
						break;
					case 30:
						healthBar.setFill("red");
						break;
				}
			} else {
				healthBar.setWidth(healthBar.getWidth() - 30);
				body.remove();
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				dead(body.getX(), body.getY(), layer);
			}
		}

		for (var i = 0; i < bullets.length; i++) {
			// Get coordinate and distance between bullets and this enemy
			var distance2 = getDistance(enemy.getX(), enemy.getY(), bullets[i][0].getX(), bullets[i][0].getY());
			if (distance2 <= 30) {
				// Enemy hit by bullets, remove enemy and stop the animation
				clearInterval(bulletInt);
				explosion(enemy.getX(), enemy.getY(), layer);
				remove(bullets, bullets[i][0], bullets[i][1], i);
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
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
	var enemyPair = [];
	enemyPair.push(enemy);
	enemyPair.push(enemyAnim);
	enemies.push(enemyPair);
}
function enemyTowardPlayer(layer, enemies, bullets, body, enemyBullets, healthBar, protect) {
	/**
	 *	Create a basic enemy plane
	 */
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets

	var enemy = loadImage(px, py, 30, 40, layer, "pictures/enemy1.png", 1, [15, 20], 180);
	
	// Get the angle between the player and the enemy
	
	var enemyAnim = new Kinetic.Animation(function(frame) {
	
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
		}

		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 50 && !protect) {
			if (healthBar.getWidth("width") > 30) {
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				healthBar.setWidth(healthBar.getWidth() - 50);
				switch (healthBar.getWidth()) {
					case 130:
						healthBar.setFill("yellow");
						break;
					case 80:
						healthBar.setFill("orange");
						break;
					case 30:
						healthBar.setFill("red");
						break;
				}
			} else {
				// The player is dead
				healthBar.setWidth(healthBar.getWidth() - 30);
				body.remove();
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				dead(body.getX(), body.getY(), layer);
			};
		}

		for (var i = 0; i < bullets.length; i++) {
			// Get coordinate and distance between bullets and this enemy
			var distance2 = getDistance(enemy.getX(), enemy.getY(), bullets[i][0].getX(), bullets[i][0].getY());
			if (distance2 <= 30) {
				// Enemy hit by bullets, remove enemy and stop the animation
				explosion(enemy.getX(), enemy.getY(), layer);
				remove(bullets, bullets[i][0], bullets[i][1], i);
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
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
	var enemyPair = [];
	enemyPair.push(enemy);
	enemyPair.push(enemyAnim);
	enemies.push(enemyPair);
};
function enemy(layer, enemies, bullets, body, enemyBullets, healthBar, protect) {
	/**
	 *	Create a basic enemy plane
	 */
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets

	var enemy = loadImage(px, py, 30, 40, layer, "pictures/enemy1.png", 1, [15, 20], 180);

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
		}

		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 50 && !protect) {
			// The player is dead
			if (healthBar.getWidth("width") > 30) {
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				healthBar.setWidth(healthBar.getWidth() - 50);
				switch (healthBar.getWidth()) {
					case 130:
						healthBar.setFill("yellow");
						break;
					case 80:
						healthBar.setFill("orange");
						break;
					case 30:
						healthBar.setFill("red");
						break;
				}
			} else {
				healthBar.setWidth(healthBar.getWidth() - 30);
				body.remove();
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				dead(body.getX(), body.getY(), layer);
			}
		}

		for (var i = 0; i < bullets.length; i++) {
			// Get coordinate and distance between bullets and this enemy
			var distance2 = getDistance(enemy.getX(), enemy.getY(), bullets[i][0].getX(), bullets[i][0].getY());
			if (distance2 <= 30) {
				// Enemy hit by bullets, remove enemy and stop the animation
				explosion(enemy.getX(), enemy.getY(), layer);
				remove(bullets, bullets[i][0], bullets[i][1], i);
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
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
	var enemyPair = [];
	enemyPair.push(enemy);
	enemyPair.push(enemyAnim);
	enemies.push(enemyPair);
};

function enemyBomb(layer, enemies, bullets, body, enemyBullets, healthBar,protect) {
	// Function for displaying enemy planes

	// Get a random position for the plane
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets
	
	// Create an enemy variable with random position
	var enemy = loadImage(px, py, 30, 40, layer, "pictures/enemy1.png", 1, [15, 20], 180);

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
		}
		
		// Make the bomb based on the random position generated
		if (enemy.getY() == bulletY) {
			var angle;
			for (angle = 0; angle <= 11; angle++) {
				enemyBullet(body, enemy, layer, angle * 30, enemyBullets, healthBar,protect);
			}
		}
		// Define the collision logic here
		
		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 50 && !protect) {
			// The player is dead
			if (healthBar.getWidth("width") > 30) {
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				healthBar.setWidth(healthBar.getWidth() - 50);
				switch (healthBar.getWidth()) {
					case 130:
						healthBar.setFill("yellow");
						break;
					case 80:
						healthBar.setFill("orange");
						break;
					case 30:
						healthBar.setFill("red");
						break;
				}
			} else {
				healthBar.setWidth(healthBar.getWidth() - 30);
				body.remove();
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				dead(body.getX(), body.getY(), layer);
			}
		}

		for (var i = 0; i < bullets.length; i++) {
			// Get coordinate and distance between bullets and this enemy
			var distance2 = getDistance(enemy.getX(), enemy.getY(), bullets[i][0].getX(), bullets[i][0].getY());
			if (distance2 <= 30) {
				// Enemy hit by bullets, remove enemy and stop the animation
				explosion(enemy.getX(), enemy.getY(), layer);
				remove(bullets, bullets[i][0], bullets[i][1], i);
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
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
	
	var enemyPair = [];
	enemyPair.push(enemy);
	enemyPair.push(enemyAnim);
	enemies.push(enemyPair);
	
	
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
}
function dead(x, y, layer) {
	/**
	 * Create the dead effect when player plane is dead
	 * At position (x, y)
	 * Displayed at the provided layer
	 */
	var deadSound = new Audio('audios/explosion2.mp3');
	deadSound.play();
	clearInterval(bulletId);
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
	
	// Remove the explosion effect after a full cycle
	blob.afterFrame(35, function(){
		blob.remove();
		window.location.href = "end-page.html";
	});
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
