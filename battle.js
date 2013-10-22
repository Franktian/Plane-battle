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
	
	
	
	// var bullet = new Kinetic.Circle({
		// x:body.getX(),
		// y:body.getY(),
		// radius: 5,
		// fill: 'blue'
	// });
	// layer.add(bullet);
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

window.setInterval(
	function(){
		createBullet(body, layer, 270);
	}
, 250);

function enermy() {
	// Function for displaying enemy planes
	
	// Get a random position for the plane
	px = Math.floor((Math.random()*800) + 1);
	py = 0;
	
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
		// Define the collision logic here
		dx = Math.pow((enemy.getX() - body.getX()), 2);
		dy = Math.pow((enemy.getY() - body.getY()), 2);
		distance = Math.sqrt(dx + dy);
		if (distance <= 30) {
			alert("You lose!!!!!!!");
			location.reload();
		}

		for (var i = 0; i < bullets.length; i++) {
			// Get coordinate and distance of bullets and enemies
			x1 = enemy.getX();
			y1 = enemy.getY();
			x2 = bullets[i][0].getX();
			y2 = bullets[i][0].getY();
			ddx =Math.pow((x1 - x2), 2);
			ddy = Math.pow((y1 - y2), 2);
			ddistance = Math.sqrt(ddx + ddy);
			if (ddistance <= 25) {
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

function update (frameDelay)
{
	// draw a white background to clear canvas
	
	context2D.fillStyle = "#FFF";
	context2D.fillRect(0, 0, context2D.canvas.width, context2D.canvas.height);
	alert("HEHEHE");
	// update and draw particles
	for (var i=0; i<particles.length; i++)
	{
		var particle = particles[i];
		
		particle.update(frameDelay);
		particle.draw(context2D);
	}
}

