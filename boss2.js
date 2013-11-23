//Very incomplete, the boss shoots a big slow circle bullet that follows the player
//HOW TO USE:
//1. Take out Boss function from api.js
//2. add <script src="boss2.js" ></script> at the top of battle.html

//PS. I thought it would be better to have a js file for bosses themselves. 
//The original boss, I have it on a boss.js file on my side.

function Boss(layer, enemies, bullets, body, enemyBullets, healthBar) {
  	// Function for displaying Boss planes
	var BossHP = 7;
	var ABreak = 0;
	setTimeout(function() { // 2 Seconds after all enemy planes have stopped flying in
	    var px = 512;
	    var py = 0;
	    // Create an enemy variable with random position
	    var enemy = loadImage(px, py, 30, 40, layer, "pictures/enemy1.png", 1, [15, 20], 180);
	    var enemyAnim = new Kinetic.Animation(function(frame) {
		    var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());

		    if (distance <= 50) {
			  // The player is dead
			  body.remove();
			  explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
			  dead(body.getX(), body.getY(), layer);
		    }
		    // Move the Boss plane into position
		    if (enemy.getY() < stage.getAttr("height")/4){
			enemy.setY(enemy.getY() + 4);
		    }
		    else {
			BossAttack1(ABreak);
			ABreak = 1;
		    }

		    function BossAttack1(ABreak) {
			  if (ABreak == 0) {
			  var angle;
			  for (angle = 0; angle <= 20; angle++) {
			      enemyBullet2(body, enemy, layer, angle * 18, enemyBullets, healthBar);
			  }
			    }
		    }
		    //The boss shoots at you directly
		    function BossAttack2() {
			  var angle;
			  var x = enemy.getX() - body.getX();
			  var y = enemy.getY() - body.getY();
			  angle = -(Math.atan((x)/(y))/(Math.PI/180) + 270);
			  enemyBullet(body, enemy, layer, angle, enemyBullets, healthBar);
		    }
	    }, layer);
	    enemyAnim.start();
	    
	    var enemyPair = [];
	    enemyPair.push(enemy);
	    enemyPair.push(enemyAnim);
	    enemies.push(enemyPair);
	}, 2000);
}

function enemyBullet2(body, enemy, layer, angle, enemyBullets, healthBar, protect) {
	/**
	 * Function for the enemy plane to shoot bullets
	 * body: track the coordinate of the player
	 * enemy: The bullet is created at the center of this enemy
	 * layer: the bullet is to be added to this layer
	 * angle: The angle to be shooted
	 */
	// Bullet from enemy
	// Get the shooting angle
	var bx = 4 * Math.cos(angle * Math.PI / 180);
	var by = 4 * Math.sin(angle * Math.PI / 180);
	
	// Create the bullet object	
	var bullet = loadImage(enemy.getX(), enemy.getY(), 8, 15, layer, "pictures/bullet2.png", 1, [0, 0], angle + 90);

	var animBullet = new Kinetic.Animation(function(frame) {
		bullet.setX(bullet.getX() + bx);
		bullet.setY(bullet.getY() + by);
		var step1 = 0;
		setTimeout(function(){
			var x = enemy.getX() - body.getX();
			var y = enemy.getY() - body.getY();
			var angle1 = -(Math.atan((x)/(y))/(Math.PI/180) + 270);
			bx = 2*Math.cos(angle1 * Math.PI / 180);
			by = 2*Math.sin(angle1 * Math.PI / 180);
			bullet.setX(bullet.getX() + bx);
			bullet.setY(bullet.getY() + by);
			step1 = 1;
		},150);
		
		if (step1 == 1) {
			x = enemy.getX() - body.getX();
			y = enemy.getY() - body.getY();
			angle1 = -(Math.atan((x)/(y))/(Math.PI/180) + 270);
			bx = 2*Math.cos(angle1 * Math.PI / 180);
			by = 2*Math.sin(angle1 * Math.PI / 180);
			bullet.setX(bullet.getX() + bx);
			bullet.setY(bullet.getY() + by);
		}
		
		// Check collision with the player plane
		var distance = getDistance(bullet.getX(), bullet.getY(), body.getX(), body.getY());
		if (distance <= 30) {
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
					dead(body.getX(), body.getY(), layer);
				}
			}
			else{   	//The protection is on, the bullet will disappear when it hits the plane
				explosion(bullet.getX(), bullet.getY(), layer);
				remove(enemyBullets, bullet, this, enemyBullets.indexOf([bullet, this]));			
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

