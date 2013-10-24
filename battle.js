var stage = new Kinetic.Stage({
	container: 'container',
	width: 1024,
	height: 600
});
var layer = new Kinetic.Layer();  // Layer to display what's happening
var bullets = [];  // Keep track of the bullets
var enemies = [];  // Keep track of the enemies
var enemiesAnim = []; // Keep track of the enemy animations
var points = 0;  //  Keep track of the points the player got
var messageLayer = new Kinetic.Layer();
stage.add(messageLayer);
var background = new Kinetic.Rect({
        x: 0,
        y: 0,
        width:stage.getWidth(),
        height:stage.getHeight(),stroke: 'black',
        strokeWidth: 1
});
layer.add(background);

var bodyObj = new Image();
bodyObj.src = "pictures/plane.png";
var body = new Kinetic.Image({
	x:stage.getWidth()/2,
	y:stage.getHeight()/2,
	image: bodyObj,
	width: 60,
	height: 80,
	offset: [30, 40]
});
 
layer.add(body);
stage.add(layer);

// Moving animation for body
var animRight = new Kinetic.Animation(function(frame) {
	if (body.getX() <= stage.getAttr("width") - 80) {
		body.setX(body.getX() + 5);
	}  
}, layer);

var animUp = new Kinetic.Animation(function(frame) {
	if (body.getY() >= 10) {
		body.setY(body.getY() - 5);
	}
}, layer);

var animLeft = new Kinetic.Animation(function(frame) {
	if (body.getX() >= 10) {
		body.setX(body.getX() - 5);
	}

}, layer);

var animDown = new Kinetic.Animation(function(frame) {
	if (body.getY() <= stage.getAttr("height") - 55) {
	  body.setY(body.getY() + 5);
	}
}, layer);
var i = 0;
// Event for control the body
window.addEventListener('keydown', function(e) {
	switch (e.keyCode) {
		case 37:
			// Left
			animLeft.start();
			break;
		case 38:
			// Up
			animUp.start();
			break;
		case 39:
			// Right
			animRight.start();
			break;
		case 40:
			// Down
			animDown.start();
			break;
		case 32:
			// var angle;
			// for (angle = 0; angle <= 350; angle += 10) {
				// setTimeout(alert("HEHE"), 3000);
			// }
			i = 0;
			allDegree();
			
			break;
	}
});


window.addEventListener('keyup', function(e) {
	switch (e.keyCode) {
		case 37:
			animLeft.stop();
			break;
		case 38:
			animUp.stop();
			break;
		case 39:
			animRight.stop();
			break;
		case 40:
			animDown.stop();
			break;
	}
});

function writeMessage(messageLayer, message) {
		var context = messageLayer.getContext();
		messageLayer.clear();
		context.font = '18pt Calibri';
		context.fillStyle = 'black';
		context.fillText(message, 50, 25);  // The position to be displayed on the stage
};
// Create a bullet

function createBullet(body, layer, angle) {
	// The bullet body
	var bx = 8 * Math.cos(angle * Math.PI / 180);
	var by = 8 * Math.sin(angle * Math.PI / 180);
	
	var bulletObj = new Image();
	bulletObj.src = "pictures/bullet.png";
	var bullet = new Kinetic.Image({
		x:body.getX() - 5,
		y:body.getY() - 40,
		image: bulletObj,
		width: 12,
		height: 25,
		rotationDeg: angle + 90
	});
	layer.add(bullet);
	
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
	// Bullet from enemy
	
	// Get the shooting angle
	var bx = 6 * Math.cos(angle * Math.PI / 180);
	var by = 6 * Math.sin(angle * Math.PI / 180);
	
	// Create the bullet object
	var bulletObj = new Image();
	bulletObj.src = "pictures/bullet.png";
	var bullet = new Kinetic.Image({
		x:enemy.getX(),
		y:enemy.getY(),
		image: bulletObj,
		width: 12,
		height: 25,
		rotationDeg: angle + 90
	});
	layer.add(bullet);
	
	
	var animBullet = new Kinetic.Animation(function(frame) {
		bullet.setX(bullet.getX() + bx);
		bullet.setY( bullet.getY() + by);
		
		// Check collision with the player plane
		var distance = getDistance(bullet.getX(), bullet.getY(), body.getX(), body.getY());
		if (distance <= 30) {
			// The player lose the game
			window.location.href = "start-page.html";
		}
		// Check boundary, once hit the bound, remove the bullet and stop the animation
		if (bullet.getY() <= 5 || bullet.getY() >= stage.getAttr("height") - 50 || bullet.getX() <= 50 || bullet.getX() >= stage.getAttr("width") - 50) {
			bullet.remove();
			this.stop();
		}
	});
	animBullet.start();
};

window.setInterval(
	function(){
		createBullet(body, layer, 270);
	}
, 250);

function enermy() {
	// Function for displaying enemy planes
	
	// Get a random position for the plane
	var px = Math.floor((Math.random()*1024) + 1);
	var py = 0;
	var bulletY = Math.floor(Math.random()*600); // Get a random position to create the enemy bullets
	
	// Create an enemy variable with random position
	var enemyObj = new Image();
	enemyObj.src = "pictures/enemy.png";
	// Create an enemy variable with random position
	var enemy = new Kinetic.Image({
		x: px,
		y: py,
		image: enemyObj,
		width: 20,
		height: 30,
		rotationDeg: 180,
		offset: [10, 15]
	});

	layer.add(enemy); // Add the enemy variable to layer
	enemies.push(enemy);  // Add the enemy to the enemies list
	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") + 20){
			enemies.splice(enemies.indexOf(enemy), 1);
			enemy.remove();
			this.stop();
		}
		
		// Make the bomb based on the random position generated
		if (enemy.getY() == bulletY) {
			var angle;
			for (angle = 0; angle <= 12; angle++) {
				enemyBullet(body, enemy, layer, angle * 30);
			}
		}
		// Define the collision logic here
		var distance = getDistance(enemy.getX(), enemy.getY(), body.getX(), body.getY());
		if (distance <= 30) {
			body.remove();
			enemy.remove();
			this.stop();
			alert("YOU LOSE!!!!");
			window.location.href = "start-page.html";
		}

		for (var i = 0; i < bullets.length; i++) {
			// Get coordinate and distance between bullets and this enemy
			var distance2 = getDistance(enemy.getX(), enemy.getY(), bullets[i][0].getX(), bullets[i][0].getY());
			if (distance2 <= 25) {
				// Enemy hit by bullets, remove enemy and stop the animation
				enemies.splice(enemies.indexOf(enemy), 1);
				enemy.remove();
				this.stop();
				bullets[i][0].remove();
				bullets[i][1].stop();
				bullets.splice(i, 1);
				points += 1;
				writeMessage(messageLayer, points);
			} else if (bullets[i][0].getY() <= 5 || bullets[i][0].getY() >= stage.getAttr("height") - 50 || bullets[i][0].getX() <= 50 || bullets[i][0].getX() >= stage.getAttr("width") - 50) {
				// If the bullet hit the bound, remove the bullet and stop its animation
				bullets[i][0].remove();
				bullets[i][1].stop();
				bullets.splice(i, 1);
			} 
		}
		enemy.setY(enemy.getY() + 4);
	}, layer);
	enemyAnim.start();
	enemiesAnim.push(enemyAnim);
};

// Function for shooting the bullets in all 360 degrees
function allDegree() {
	if (i < 36) {
		window.setTimeout("allDegree()", 50);
		createBullet(body, layer, i * 10);
		i++;
	}
};

window.setInterval(function(){
	enermy();
}, 200);
// Effect for the explosion

function getDistance(x1, y1, x2, y2) {
	// Get the distance between (x1, y1) and (x2, y2)
	var dx =Math.pow((x1 - x2), 2);
	var dy = Math.pow((y1 - y2), 2);
	var distance = Math.sqrt(dx + dy);
	return distance;
};

