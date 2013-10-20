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

var body = new Kinetic.Circle({
	x:stage.getWidth()/2,
	y:stage.getHeight()/2,
	radius:30,
	stroke: 'black',
	strokeWidth: 4
});

layer.add(body);
stage.add(layer);

var background = new Kinetic.Rect({
	x: 0,
	y: 0,
	width:stage.getWidth(),
	height:stage.getHeight(),stroke: 'black',
	strokeWidth: 1
});
layer.add(background);

//--------------------------------------------
var canvas
var context2D;


window.addEventListener("load", function(){
	canvas = layer.getCanvas();
	context2D = canvas.getContext("2d");
	
	var frameRate = 60.0;
	var frameDelay = 1000.0/frameRate;
	setInterval(function()
	{	
		update(frameDelay);
	}, frameDelay);
});

//--------------------------------------------

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
			// Clear all the enemies
			for (var i = 0; i < enemies.length; i++) {
				enemies[i].remove();
			}
			for (var j = 0; j < enemiesAnim.length; j++) {
				enemiesAnim[j].stop();
			}
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

function createBullet(body, layer) {
	// The bullet body
	var bullet = new Kinetic.Circle({
		x:body.getX(),
		y:body.getY(),
		radius: 5,
		fill: 'blue'
	});
	layer.add(bullet);
	var animBullet = new Kinetic.Animation(function(frame) {
		bullet.setY( bullet.getY() - 10);
		// Once reaches the bound, remove bullet
		if (bullet.getY() <= 5) {
			bullet.remove();
			this.stop();
		}
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
		createBullet(body, layer);
	}
, 250);

function enermy() {
	// Function for displaying enemy planes
	
	// Get a random position for the plane
	px = Math.floor((Math.random()*800) + 1);
	py = 0;
	
	// Create an enemy variable with random position
	var enemy = new Kinetic.Circle({
		x: px,
		y: py,
		radius: 5,
		stroke: 'black',
		strokeWidth: 5
	});

	layer.add(enemy); // Add the enemy variable to layer
	enemies.push(enemy);  // Add the enemy to the enemies list
	var enemyAnim = new Kinetic.Animation(function(frame) {
		// Once reach bound, remove the enemy plane
		if (enemy.getY() >= stage.getAttr("height") - 5){
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
			if (ddistance <= 20) {
				// Enemy hit by bullets, remove enemy and stop the animation
				enemies.splice(enemies.indexOf(enemy), 1);
				enemy.remove();
				this.stop();
				bullets[i][0].remove();
				bullets[i][1].stop();
				bullets.splice(i, 1);
				points += 1;
				writeMessage(messageLayer, points);

				createExplosion(x1, y1, "#525252");
				createExplosion(x1, y1, "#FFA318");
			}
		}
		enemy.setY(enemy.getY() + 4);
	}, layer);
	enemyAnim.start();
	enemiesAnim.push(enemyAnim);
};

var particles = [];

function randomFloat (min, max)
{
	return min + Math.random()*(max-min);
}

/*
 * A single explosion particle
 */
function Particle ()
{
	this.scale = 1.0;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.color = "#000";
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;
	
	this.update = function(ms)
	{
		// shrinking
		this.scale -= this.scaleSpeed * ms / 1000.0;
		
		if (this.scale <= 0)
		{
			this.scale = 0;
		}
		
		// moving away from explosion center
		this.x += this.velocityX * ms/1000.0;
		this.y += this.velocityY * ms/1000.0;
	};
	
	this.draw = function(context2D)
	{
		// translating the 2D context to the particle coordinates
		context2D.save();
		context2D.translate(this.x, this.y);
		context2D.scale(this.scale, this.scale);

		// drawing a filled circle in the particle's local space
		context2D.beginPath();
		context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
		context2D.closePath();
		
		context2D.fillStyle = this.color;
		context2D.fill();
		
		context2D.restore();
	};
}

/*
 * Basic Explosion, all particles move and shrink at the same speed.
 * 
 * Parameter : explosion center
 */

/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 * 
 * Parameters:
 * 	x, y - explosion center
 * 	color - particles' color
 */
function createExplosion(x, y, color)
{
	var minSize = 10;
	var maxSize = 30;
	var count = 10;
	var minSpeed = 60.0;
	var maxSpeed = 200.0;
	var minScaleSpeed = 1.0;
	var maxScaleSpeed = 4.0;
	
	for (var angle=0; angle<360; angle += Math.round(360/count))
	{
		var particle = new Particle();
		
		particle.x = x;
		particle.y = y;
		
		particle.radius = randomFloat(minSize, maxSize);
		
		particle.color = color;
		
		particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
		
		var speed = randomFloat(minSpeed, maxSpeed);
		
		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
		
		particles.push(particle);
	}
}





window.setInterval(function(){
	enermy();
}, 100);
// Effect for the explosion

function update (frameDelay)
{
	// draw a white background to clear canvas
	context2D.fillStyle = "#FFF";
	context2D.fillRect(0, 0, context2D.canvas.width, context2D.canvas.height);
	
	// update and draw particles
	for (var i=0; i<particles.length; i++)
	{
		var particle = particles[i];
		
		particle.update(frameDelay);
		particle.draw(context2D);
	}
}
