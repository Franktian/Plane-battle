function Boss(layer, enemies, bullets, body, enemyBullets, healthBar, bossHealthBar, points) {
  	// Function for displaying Boss planes
	var BossHP = 7;
	
	// Set the boss health bar
	layer.add(bossHealthBar);
	setTimeout(function() { // 2 Seconds after all enemy planes have stopped flying in
	    var px = 512;
	    var py = 0;

	    // Create an enemy variable with random position
	    var enemy = loadImage(px, py, 30, 40, layer, "pictures/enemy1.png", 1, [15, 20], 180);
	    var enemyAnim = new Kinetic.Animation(function(frame) {
		    // Move the Boss plane into position
		    if (enemy.getY() < stage.getAttr("height")/4){
			enemy.setY(enemy.getY() + 4);
		    }
		    var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());

		    if (distance <= 50) {
			  // The player is dead
			  body.remove();
			  remove(enemies, enemy, this, enemies.indexOf([enemy, this]));  // Remove the enemy plane
			  explosion(enemy.getX(), enemy.getY(), layer);  // Display the explosion animation
			  dead(body.getX(), body.getY(), layer);
		    }
		    
		    for (var i = 0; i < bullets.length; i++) {
			    // Get coordinate and distance between bullets and this enemy
			    var distance2 = getDistance(enemy.getX(), enemy.getY(), bullets[i][0].getX(), bullets[i][0].getY());
			    
			    if ((enemy.getX() > 100) && (enemy.getX() < 924)) {
				
				if (bullets[i][0].getY() > enemy.getY()) {
				    if ((body.getX() < enemy.getX()) && ((enemy.getX() - body.getX()) < 100)) {
					BossAttack2();
					enemy.setX(enemy.getX() + 6);
					break;
				    }
				    else if (body.getX() > enemy.getX() && ((body.getX() - enemy.getX()) < 100)) {
					BossAttack2();
					enemy.setX(enemy.getX() - 6);
					break;
				    }
				}
			    }
			    // Boss gets hit by player bullet
			    if (distance2 <= 30) {
					BossHP--;
					if (bossHealthBar.getWidth() > 10) {
						bossHealthBar.setWidth(bossHealthBar.getWidth() - 30);
						switch (bossHealthBar.getWidth()) {
							case 160:
								bossHealthBar.setFill("FFFF00");
								break;
							case 130:
								bossHealthBar.setFill("FFCC00");
								break;
							case 100:
								bossHealthBar.setFill("FF9900");
								break;
							case 70:
								bossHealthBar.setFill("FF6600");
							case 40:
								bossHealthBar.setFill("FF3300");
								break;
							case 10:
								bossHealthBar.setFill("FF0000");
								break;
						}
					} else {
						bossHealthBar.setWidth(bossHealthBar.getWidth() - 10);
					}

				  BossAttack1();
				  explosion(enemy.getX(), enemy.getY(), layer);
				  remove(bullets, bullets[i][0], bullets[i][1], i);
				  if (BossHP == 0) {
				      remove(enemies, enemy, this, enemies.indexOf([enemy, this]));
				      points += 100;
					  setTimeout(function() {
						window.location.href = "start-page.html";
					  }, 1500);
					  
				  } else {
				      if (body.getX() >= enemy.getX()) {
					  if ((enemy.getX() - 90) > 100)
					      enemy.setX(enemy.getX() - 90);
					  else
					      enemy.setX(enemy.getX() + 90);
				      }
				      else if (body.getX() <= enemy.getX()) {
					  if ((enemy.getX() + 90) < 924)
					      enemy.setX(enemy.getX() + 90);
					  else
					      enemy.setX(enemy.getX() - 90);
				      }
				  }
			    } else if (bullets[i][0].getY() <= 5 || bullets[i][0].getY() >= stage.getAttr("height") - 50 || bullets[i][0].getX() <= 50 || bullets[i][0].getX() >= stage.getAttr("width") - 50) {
				    // If the bullet hit the bound, remove the bullet and stop its animation
				    remove(bullets, bullets[i][0], bullets[i][1], i);
			    }
		    }
		    
		    
		    if (enemy.getX() < body.getX()) {
			  enemy.setX(enemy.getX() + 3);
		    }
		    
		    if (enemy.getX() > body.getX()) {
			  enemy.setX(enemy.getX() - 3);
		    }
		    
 		    //Every time the boss gets hit it will do at 360 attack
		    function BossAttack1() {
			  var angle;
			  for (angle = 0; angle <= 20; angle++) {
			      enemyBullet(body, enemy, layer, angle * 18, enemyBullets, healthBar);
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
};