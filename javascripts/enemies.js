function enemy(layer, enemies, bullets, body, enemyBullets, healthBar) {
	/**
	 *	Create a basic enemy plane
	 */
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets
	var speed = Math.floor(Math.random()*(4)+3);
	var enemy = loadImage(px, py, 30, 30, layer, "pictures/enemy1.png", 1, [15, 20], 180);

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
		}

		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 80) {
			if(protect) {
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation	
			}
		}
		if (distance <= 50) {
			if(!protect){
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
				} else if (healthBar.getWidth("width") > 0 ) {
					healthBar.setWidth(healthBar.getWidth() - 30);
					body.remove();
					remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
					explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				}
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
		enemy.setY(enemy.getY() + speed);
	}, layer);
	enemyAnim.start();
	var enemyPair = [];
	enemyPair.push(enemy);
	enemyPair.push(enemyAnim);
	enemies.push(enemyPair);
};
function enemyBomb(layer, enemies, bullets, body, enemyBullets, healthBar) {
	/**
	 * Create an enemy that create bomb bullets
	 */
	// Get a random position for the plane
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets
	
	// Create an enemy variable with random position
	var enemy = loadImage(px, py, 30, 30, layer, "pictures/enemy1.png", 1, [15, 20], 180);

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
		}
		
		// Make the bomb based on the random position generated
		if (enemy.getY() == bulletY) {
			var angle;
			for (angle = 0; angle <= 11; angle++) {
				enemyBullet(body, enemy, layer, angle * 30, enemyBullets, healthBar);
			}
		}
		// Define the collision logic here
		
		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 80) {
			if(protect) {
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation	
			}
		}
		if (distance <= 50) {
			// The player is dead
			if(!protect){
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
				} else if (healthBar.getWidth("width") > 0){
					healthBar.setWidth(healthBar.getWidth() - 30);
					body.remove();
					remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
					explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				}
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
function enemyToPlayer(layer, enemies, bullets, body, enemyBullets, healthBar) {
	/**
	 *	Create a basic enemy plane that follows the player's  coordinates
	 */
	var px = Math.floor((Math.random()*776) + 1);
	var py = 0;
	//var bulletY = Math.floor(Math.random()*580); // Get a random position to create the enemy bullets
	var speed = 3;
	var enemy = loadImage(px, py, 30, 30, layer, "pictures/enemy1.png", 1, [15, 20], 180);

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
		}

		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 80) {
			if(protect) {
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation	
			}
		}
		if (distance <= 50) {
			if(!protect){
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
				} else if (healthBar.getWidth("width") > 0) {
					healthBar.setWidth(healthBar.getWidth() - 30);
					body.remove();
					remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
					explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				}
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
		
		// Track the player plane and follow it
		if (enemy.getY() > body.getY()) {
			enemy.setY(enemy.getY() - speed);
		} else {
			enemy.setY(enemy.getY() + speed);
		}

		if (enemy.getX() > body.getX()) {
			enemy.setX(enemy.getX() - speed);
		} else {
			enemy.setX(enemy.getX() + speed);
		}
		//enemy.setY(enemy.getY() + speed);
	}, layer);
	enemyAnim.start();
	var enemyPair = [];
	enemyPair.push(enemy);
	enemyPair.push(enemyAnim);
	enemies.push(enemyPair);
};
function enemyBullet(body, enemy, layer, angle, enemyBullets, healthBar) {
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
		if (distance <= 80) {
			if(protect) {
				remove(enemyBullets, bullet, this, enemyBullets.indexOf([bullet, this]));  // Remove the enemy plane
				explosion(bullet.getX(), bullet.getY(), layer);  // Display the explosion animation	
			}
		}
		if (distance <= 50) {
			if(!protect){   // The protection is off
				// The player lose the game, remove the player plane and the bullet, stop animation			
				if (healthBar.getWidth() > 30) {
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
				} else if (healthBar.getWidth() > 0) {
					healthBar.setWidth(healthBar.getWidth() - 30);
					explosion(bullet.getX(), bullet.getY(), layer);  // Display the explosion animation
					remove(enemyBullets, bullet, this, enemyBullets.indexOf([bullet, this]));
					body.remove();
				}
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
function createBullet(stage, body, layer, angle, bullets) {
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
		if (bullet.getY() <= 5 || bullet.getY() >= stage.getAttr("height") - 50 || bullet.getX() <= 50 || bullet.getX() >= stage.getAttr("width") - 50) {
			remove(enemyBullets, bullet, this, enemyBullets.indexOf([bullet, this]));
		}
	});
	animBullet.start();  // Start the animation
	// Add the bullet and its animation to a list
	var bulletPair = [];
	bulletPair.push(bullet);
	bulletPair.push(animBullet);
	bullets.push(bulletPair);
};
function enemyForwardBullet(layer, enemies, bullets, body, enemyBullets, healthBar) {
	/**
	 *	Create a basic enemy plane that shoots forward bullets
	 */
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets

	var enemy = loadImage(px, py, 30, 30, layer, "pictures/enemy1.png", 1, [15, 20], 180);
	var bulletInt = setInterval(function(){
		enemyBullet(body, enemy, layer, 90, enemyBullets, healthBar);
	}, 800);

	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
			clearInterval(bulletInt);
		}

		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 80) {
			if(protect) {
				clearInterval(bulletInt);
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation	
			}
		}
		if (distance <= 50) {
			if(!protect){
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
				 } else if (healthBar.getWidth("width") > 0){
					healthBar.setWidth(healthBar.getWidth() - 30);
					body.remove();
					remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
					explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
				}
				clearInterval(bulletInt);
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

	var enemy = loadImage(px, py, 30, 30, layer, "pictures/enemy1.png", 1, [15, 20], 180);
	
	// Get the angle between the player and the enemy
	
	var enemyAnim = new Kinetic.Animation(function(frame) {
	
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
		}

		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 50) {
			if(!protect){
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
					}
			}
			else{
				clearInterval(bulletInt);
				remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
				explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation					
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
