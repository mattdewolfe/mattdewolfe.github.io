(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(Game.gameWidth, Game.gameHeight, Phaser.AUTO, 'project-4x');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":11,"./states/gameover":12,"./states/menu":13,"./states/play":14,"./states/preload":15}],2:[function(require,module,exports){
'use strict';

var ShipStats = require('../prefabs/ShipStats');
// need to add in steering requisite
var BaseEnemyShip = function(game, x, y, shipType, target) {
  Phaser.Sprite.call(this, game, x, y, shipType);

  // Store the starting X value for reset
  this.shipClass = 'minion';
  this.shipStats = new ShipStats();
  this.seekBoss = false;
  this.bossShip;
  this.target = target;
  this.anchor.setTo(0.5);
  this.scale.setTo(0.65);
  this.game.add.existing(this);
  // Enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.enable = true;
  this.body.allowGravity = false;
  this.body.setSize(this.width, this.height, 0, 0);
};

BaseEnemyShip.prototype = Object.create(Phaser.Sprite.prototype);
BaseEnemyShip.prototype.constructor = BaseEnemyShip;

/**
 * Updates the sprite every frame
 */
BaseEnemyShip.prototype.update = function()
{
  this.calculateSteering();
  this.rotation += 0.1;
};

BaseEnemyShip.prototype.canFire = function(time)
{
  if (this.shipStats.withinRange == true) {
    if (time > this.shipStats.nextFire) {
      this.shipStats.nextFire = time + this.shipStats.fireRate;
      return true;
    }
    else {
      return false;
    }
  }
};

// Set the sprite to alive, reset key values
BaseEnemyShip.prototype.spawn = function()
{
  this.shipStats.init(this.shipClass);
  this.exists = true;
  this.visible = true;
  this.alive = true;
};

BaseEnemyShip.prototype.getName = function()
{
  return this.shipClass;
};

// Calculate target vector depending on steering pattern
BaseEnemyShip.prototype.calculateSteering = function()
{
  var x;
  var y;
  if (this.seekBoss === true) {
    x = this.bossShip.x - this.x;
    y = this.bossShip.y - this.y;
  }
  else {
    // Calculate velocity to target position
    x = this.target.x - this.x;
    y = this.target.y - this.y;
  }

  var mag = Math.sqrt(x*x + y*y);
  // If enemy is with arrive radius, decrease speed
  if (mag < this.shipStats.arriveRadius){
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.shipStats.arriveAcceleration;
    y *= this.shipStats.arriveAcceleration;
    this.shipStats.withinRange = true;
  }
  // If enemy is not with arrive radius, continue applying
  // steering motion
  else {
    // Clamp target vector to the max velocity
    if (mag > this.shipStats.maxVelocity) {
      x = this.normalizeValue(x, mag);
      y = this.normalizeValue(y, mag);
      x *= this.shipStats.maxVelocity;
      y *= this.shipStats.maxVelocity;
    }
    // Subtract target vector from current velocity
    x -= this.body.velocity.x;
    y -= this.body.velocity.y;

    // Check if new target vector is beyond max acceleration of ship
    mag = Math.sqrt(x * x + y * y);
    // If it is, normalize and clamp to max acceleration value
    if (mag > this.shipStats.maxAcceleration) {
      x = this.normalizeValue(x, mag);
      y = this.normalizeValue(y, mag);
      x *= this.shipStats.seekAcceleration;
      y *= this.shipStats.seekAcceleration;
    }
  }
  this.setAcceleration(x, y);
};

/* Returns a normalized vector, presumes magnitude was just calculated and
* can be passed in again rather than being calculated a second time
* @parem (input vector, input vectorMag)
*/
BaseEnemyShip.prototype.normalizeValue = function(inVal, magnitude)
{
  return inVal/magnitude;
};
/**
 * Sets body's acceleration
 * @param {int x-axis acceleration, int y-axis acceleration}
 */
BaseEnemyShip.prototype.setAcceleration = function(xVal, yVal)
{
  this.body.acceleration.x = xVal;
  this.body.acceleration.y = yVal;
};

/**
 * Call when this sprite is killed, stops updates and moves it offscreen
 */
BaseEnemyShip.prototype.wasKilled = function()
{
  this.exists = false;
  this.visibile = false;
  this.alive = false;
  this.seekBoss = false;
  this.shipStats.withinRange = false;
  this.x = 0;
  this.y = this.game.height;
};

/**
 * Renders ships' physics body
 */
BaseEnemyShip.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = BaseEnemyShip;

},{"../prefabs/ShipStats":9}],3:[function(require,module,exports){
'use strict';

var BigLaserProjectile = function(game, parent, targetX, targetY, type) {
  var x = parent.body.position.x + parent.width/2;
  var y = parent.body.position.y + parent.height/2;
  var rotation = Phaser.Math.angleBetween(x, y, targetX, targetY);
  x += Math.sin(rotation) * 32;
  y += Math.cos(rotation) * 32;

  Phaser.Sprite.call(this, game, x, y, type, 0);
  this.anchor.setTo(0.5);
  this.scale.setTo(0.6);
  this.damage = 50;
  this.animations.add(type);
  this.animations.play(type, 20, true);
  this.game.add.existing(this);

  // Enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.allowGravity = false;
  this.body.setSize(this.width*0.75, this.height*0.75, 0, 0);
  this.body.velocity.x = Math.sin(rotation) * 250;
  this.body.velocity.y = Math.cos(rotation) * 250;

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

};

BigLaserProjectile.prototype = Object.create(Phaser.Sprite.prototype);
BigLaserProjectile.prototype.constructor = BigLaserProjectile;

BigLaserProjectile.prototype.update = function() {

};

module.exports = BigLaserProjectile;

},{}],4:[function(require,module,exports){
'use strict';

var ShipStats = require('../prefabs/ShipStats');
// need to add in steering requisite
var BossEnemyShip = function(game, x, y, shipType) {
  Phaser.Sprite.call(this, game, x, y, shipType);

  // Store the starting X value for reset
  this.shipClass = 'battleship';
  this.shipStats = new ShipStats();
  this.arcFactor = 30;
  this.health = 10;
  this.targetX = 150;
  this.targetY = this.game.height/1.5;
  this.anchor.setTo(0.5);
  this.scale.setTo(0.65);
  // Enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.game.add.existing(this);
  this.body.enable = true;
  this.body.allowGravity = false;
  this.body.collideWorldBounds = true;
  this.body.setSize(this.width, this.height, 0, 0);
};

BossEnemyShip.prototype = Object.create(Phaser.Sprite.prototype);
BossEnemyShip.prototype.constructor = BossEnemyShip;

/**
 * Updates the sprite every frame
 */
BossEnemyShip.prototype.update = function()
{
  this.calculateSteering();
  this.checkPosition();
  this.rotation += 0.1;
};

// Check position and switch target position if needed
BossEnemyShip.prototype.checkPosition = function()
{
  var distance = Math.abs(this.x - this.targetX);
  if (distance < 10)
  {
    if (this.targetX > this.game.width/2)
    {
      this.targetX = 150;
    }
    else
    {
      this.targetX = this.game.width - 150;
    }
  }
};

// Set the sprite to alive, reset key values
BossEnemyShip.prototype.spawn = function()
{
  this.shipStats.init(this.shipClass);
  this.health = 10;
  this.exists = true;
  this.visible = true;
  this.alive = true;
};

/**
 * Call when this sprite is killed, stops updates and moves it offscreen
 */
BossEnemyShip.prototype.wasKilled = function()
{
  this.exists = false;
  this.visibile = false;
  this.alive = false;
  this.shipStats.withRange = false;
  this.x = this.game.width - 48;
  this.y = this.game.height - 48;
};

BossEnemyShip.prototype.canFire = function(time)
{
  if (this.shipStats.withRange == true)
  {
    if (time > this.shipStats.nextFire)
    {
      this.shipStats.nextFire = time + this.shipStats.fireRate;
      return true;
    }
    else
    {
      return false;
    }
  }
};

BossEnemyShip.prototype.randomWithRange = function(min, max)
{
  var range = (max - min) + 1;
  return (Math.random() * range) + min;
};

// Calculate target vector depending on steering pattern
BossEnemyShip.prototype.calculateSteering = function()
{
  var x;
  var y;
  // Calculate velocity to target position
  x = this.targetX - this.x;
  y = this.targetY - this.y;

  var mag = Math.sqrt(x*x + y*y);
  // If enemy is not with arrive radius, continue applying
  // steering motion

  // Clamp target vector to the max velocity
  if (mag > this.shipStats.maxVelocity) {
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.shipStats.maxVelocity;
    y *= this.shipStats.maxVelocity;
  }
  // Subtract target vector from current velocity
  x -= this.body.velocity.x;
  y -= this.body.velocity.y;

  // Check if new target vector is beyond max acceleration of ship
  mag = Math.sqrt(x * x + y * y);
  // If it is, normalize and clamp to max acceleration value
  if (mag > this.shipStats.maxAcceleration) {
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.shipStats.seekAcceleration;
    y *= this.shipStats.seekAcceleration;
  }
  this.body.acceleration.x = x;
  this.body.acceleration.y = y;

};


/* Returns a normalized vector, presumes magnitude was just calculated and
* can be passed in again rather than being calculated a second time
* @parem (input vector, input vectorMag)
*/
BossEnemyShip.prototype.normalizeValue = function(inVal, magnitude)
{
  return inVal/magnitude;
};

BossEnemyShip.prototype.getName = function()
{
  return this.shipClass;
};

/**
 * Renders ships' physics body
 */
BossEnemyShip.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = BossEnemyShip;

},{"../prefabs/ShipStats":9}],5:[function(require,module,exports){
'use strict';

var MissileProjectile = function(game, parent, target, type) {
  Phaser.Sprite.call(this, game, parent.x, parent.y, type);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.enable(this, Phaser.Physics.ARCADE);

  this.scale.setTo(0.8);
  this.animations.add(type);
  this.animations.play(type, 15, true);

  // Define constants that affect motion
  this.maxSpeed = 300; // missile speed pixels/second
  this.acceleration = 100;
  this.turnRate = 30; // turn rate in degrees/frame
  this.damage = 2;
  this.target = target;
  this.rotation = parent.rotation;
};

MissileProjectile.prototype = Object.create(Phaser.Sprite.prototype);
MissileProjectile.prototype.constructor = MissileProjectile;

MissileProjectile.prototype.update = function() {
  // Calculate the angle from the missile to the mouse cursor game.input.x
  // and game.input.y are the mouse position; substitute with whatever
  // target coordinates you need.
  var targetAngle = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
  this.rotation = targetAngle;

  var x;
  var y;
  // Calculate velocity to target position
  x = this.target.x - this.x;
  y = this.target.y - this.y;

  var mag = Math.sqrt(x*x + y*y);
  // steering motion
   // Clamp target vector to the max velocity
  if (mag > this.maxSpeed) {
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.maxSpeed;
    y *= this.maxSpeed;
  }
  // Subtract target vector from current velocity
  x -= this.body.velocity.x;
  y -= this.body.velocity.y;

  // Check if new target vector is beyond max acceleration of ship
  mag = Math.sqrt(x * x + y * y);
  // If it is, normalize and clamp to max acceleration value
  if (mag > this.acceleration) {
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.acceleration;
    y *= this.acceleration;
  }

  this.body.acceleration.x = x;
  this.body.acceleration.y = y;
};

MissileProjectile.prototype.normalizeValue = function(inVal, magnitude)
{
  return inVal/magnitude;
};

module.exports = MissileProjectile;

},{}],6:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var NavPoint = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'navPoint');

  this.name = "navpoint";
  this.anchor.setTo(0.5);
  this.game.add.existing(this);
  // Enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.allowGravity = false;
  this.body.setSize(this.width * 0.85, this.height * 0.85, 0, 0);
  this.body.allowRotation = false;
};

NavPoint.prototype = Object.create(Phaser.Sprite.prototype);
NavPoint.prototype.constructor = NavPoint;

/**
 * Updates the sprite every frame
 */
NavPoint.prototype.update = function()
{

};

NavPoint.prototype.toggleRender = function()
{
  this.visibibility = !this.visibility;
}
/**
 * Render the waypoint to screen
 */
NavPoint.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = NavPoint;

},{}],7:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var PlayerShip = function(game) {
  Phaser.Sprite.call(this, game, Game.gameWidth/2, Game.gameHeight/2, 'playerShip');

  this.name = "player";
  this.health = 9999;
  this.fireRate = 200;
  this.nextFire = 0;
  this.currentWeapon = 1;
  this.anchor.setTo(0.5);
  game.add.existing(this);
  // Enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.allowGravity = false;
  this.body.setSize(this.width * 0.85, this.height * 0.85, 0, 0);
  this.body.allowRotation = false;
};

PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
PlayerShip.prototype.constructor = PlayerShip;

/**
 * Updates the sprite every frame
 */
PlayerShip.prototype.update = function()
{
  this.rotation = this.game.physics.arcade.angleToPointer(this);
};

// Check if the player can fire their weapon
PlayerShip.prototype.CanFire = function()
{
  if (this.game.time.now > this.nextFire)
  {
    if (this.currentWeapon == 1) {
      this.fireRate = 600;
      this.nextFire = this.game.time.now + this.fireRate;
    }
    else if (this.currentWeapon == 2) {
      this.fireRate = 900;
      this.nextFire = this.game.time.now + this.fireRate;
    }
    else if (this.currentWeapon == 3) {
      this.fireRate = 900;
      this.nextFire = this.game.time.now + this.fireRate;
    }
    return true;
  }
  else
  {
    return false;
  }
};

/**
 * Sets body's velocity
 * @param {int x-axis speed, int y-axis speed}
 */
PlayerShip.prototype.setVelocity = function(moveSpeedX, moveSpeedY)
{
  this.body.velocity.x = moveSpeedX;
  this.body.velocity.y = moveSpeedY;
};

/**
 * Sets body's acceleration
 * @param {int x-axis acceleration, int y-axis acceleration}
 */
PlayerShip.prototype.setAcceleration = function(moveSpeedX, moveSpeedY)
{
  this.body.acceleration.x = moveSpeedX;
  this.body.acceleration.y = moveSpeedY;
};

/**
 * Resets the velocity, sprite & body X positions
 */
PlayerShip.prototype.reset = function()
{
  this.body.position.x = Game.gameWidth/2;
  this.body.position.y = Game.gameHeight/2;
}

/**
 * Renders ships' physics body
 */
PlayerShip.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = PlayerShip;

},{}],8:[function(require,module,exports){
'use strict';

var ShipStats = require('../prefabs/ShipStats');
// need to add in steering requisite
var RogueEnemyShip = function(game, x, y, shipType, target) {
  Phaser.Sprite.call(this, game, x, y, shipType);

  // Store the starting X value for reset
  this.shipClass = 'rogue';
  this.shipStats = new ShipStats();
  this.target = target;
  this.anchor.setTo(0.5);
  this.scale.setTo(0.85);
  this.turnRate = 2;
  this.wander = 0;
  this.wanderRate = 3;
  this.wanderRange = 300;
  this.game.add.existing(this);
  // Enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.enable = true;
  this.body.allowGravity = false;
  this.body.setSize(this.width, this.height, 0, 0);
  this.targetFound = false;
};

RogueEnemyShip.prototype = Object.create(Phaser.Sprite.prototype);
RogueEnemyShip.prototype.constructor = RogueEnemyShip;

// Set the sprite to alive, reset key values
RogueEnemyShip.prototype.spawn = function()
{
  this.shipStats.init(this.shipClass);
  this.targetFound = false;
  this.exists = true;
  this.visible = true;
  this.alive = true;
};

/**
 * Updates the sprite every frame
 */
RogueEnemyShip.prototype.update = function()
{
  this.calculateSteering();
  this.checkWandering();
  this.rotation += 0.1;
};

RogueEnemyShip.prototype.checkWandering = function()
{
  this.wander += this.wanderRate;
  var flip = false;
  // this is greater than 0, we are adding to x on wander
  if (this.wanderRate > 0)
  {
    if (this.wander > this.wanderRange)
    {
      var flip = true;
    }
  }
  // Otherwise we are subtracting from x
  else
  {
    if (this.wander < this.wanderRange)
    {
      var flip = true;
    }
  }
  if (flip === true)
  {
    this.wanderRate *= -1;
    this.wanderRange *= -1;
  }
};

RogueEnemyShip.prototype.getName = function()
{
  return this.shipClass;
};

RogueEnemyShip.prototype.canFire = function(time)
{
  if (this.shipStats.withRange === true)
  {
    if (time > this.shipStats.nextFire)
    {
      this.shipStats.nextFire = time + this.shipStats.fireRate;
      return true;
    }
    else
    {
      return false;
    }
  }
};

// Calculate target vector depending on steering pattern
RogueEnemyShip.prototype.calculateSteering = function()
{
  var x;
  var y;
  // Calculate velocity to target position
  x = this.target.x - this.x + this.wanderRate;
  y = this.target.y - this.y + this.wanderRate;

  var mag = Math.sqrt(x*x + y*y);
  // If enemy is with arrive radius, decrease speed
  if (mag < this.shipStats.arriveRadius){
    this.targetFound = true;
  }
  // If enemy is not with arrive radius, continue applying
  // steering motion

  // Clamp target vector to the max velocity
  if (mag > this.shipStats.maxVelocity) {
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.shipStats.maxVelocity;
    y *= this.shipStats.maxVelocity;
  }
  // Subtract target vector from current velocity
  x -= this.body.velocity.x;
  y -= this.body.velocity.y;

  // Check if new target vector is beyond max acceleration of ship
  mag = Math.sqrt(x * x + y * y);
  // If it is, normalize and clamp to max acceleration value
  if (mag > this.shipStats.maxAcceleration) {
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.shipStats.seekAcceleration;
    y *= this.shipStats.seekAcceleration;
  }
  this.body.acceleration.x = x + this.wanderRate;
  this.body.acceleration.y = y + this.wanderRate;

};

// Assign a new target for this ship
RogueEnemyShip.prototype.newTarget = function(newTarget)
{
  this.target = newTarget;
  this.targetFound = false;
}
/* Returns a normalized vector, presumes magnitude was just calculated and
 * can be passed in again rather than being calculated a second time
 * @parem (input vector, input vectorMag)
 */
RogueEnemyShip.prototype.normalizeValue = function(inVal, magnitude)
{
  return inVal/magnitude;
};

/**
 * Call when this sprite is killed, stops updates and moves it offscreen
 */
RogueEnemyShip.prototype.wasKilled = function()
{
  this.exists = false;
  this.visible = false;
  this.alive = false;
  this.shipStats.withRange = false;
  this.x = 0;
  this.y = this.game.height;
};

/**
 * Renders ships' physics body
 */
RogueEnemyShip.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = RogueEnemyShip;

},{"../prefabs/ShipStats":9}],9:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var ShipStats = function(shipClass) {

  this.arriveRadius;
  this.arriveVelocity;
  this.seekAcceleration;
  this.arriveAcceleration;
  this.maxVelocity;
  this.fireRate;
  this.nextFire;
  this.withRange = false;
};

ShipStats.prototype.constructor = ShipStats;

ShipStats.prototype.init = function(shipClass)
{
  console.log('ship init');
  // Rogue ships wander between points on the map
  if (shipClass === 'rogue')
  {
    this.arriveRadius = 60;
    this.arriveVelocity = 50;
    this.seekAcceleration = 50;
    this.arriveAcceleration = 50;
    this.maxVelocity = 80;
    this.fireRate = 3000;
    this.nextFire = 0;
    this.withRange = true;
  }
  // Battleships are slow moving and aggressively target the player
  else if (shipClass === 'battleship')
  {
    this.arriveRadius = 400;
    this.arriveVelocity = 75;
    this.seekAcceleration = 200;
    this.arriveAcceleration = 200;
    this.maxVelocity = 75;
    this.fireRate = 750;
    this.nextFire = 0;
    this.withRange = true;
  }
  // All other ships are minions that move to a nav point and fire on the player
  else
  {
    this.arriveRadius = 25;
    this.arriveVelocity = 5;
    this.seekAcceleration = 15;
    this.arriveAcceleration = 3;
    this.maxVelocity = 50;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.withRange = false;
  }
};

module.exports = ShipStats;

},{}],10:[function(require,module,exports){
'use strict';

var SmallLaserProjectile = function(game, parent, targetX, targetY, type) {
  var x = parent.body.position.x + parent.width/2;
  var y = parent.body.position.y + parent.height/2;
  var rotation = Phaser.Math.angleBetween(x, y, targetX, targetY);
  x += Math.sin(rotation) * 32;
  y += Math.cos(rotation) * 32;

  Phaser.Sprite.call(this, game, x, y, type, 0);
  this.anchor.setTo(0.5);
  this.scale.setTo(0.25);
  this.damage = 1;
  this.animations.add(type);
  this.animations.play(type, 20, true);
  this.game.add.existing(this);

  // Enable physics
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.allowGravity = false;
  this.body.setSize(this.width*0.75, this.height*0.75, 0, 0);
  this.body.velocity.x = Math.sin(rotation) * 175;
  this.body.velocity.y = Math.cos(rotation) * 175;

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

};

SmallLaserProjectile.prototype = Object.create(Phaser.Sprite.prototype);
SmallLaserProjectile.prototype.constructor = SmallLaserProjectile;

SmallLaserProjectile.prototype.update = function() {

};

module.exports = SmallLaserProjectile;

},{}],11:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],12:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],13:[function(require,module,exports){
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '30px spaceagefont', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'playerShip');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.bitmapText(90, Game.gameHeight/2,
      'spaceagefont', 'AI Demonstration by Matt DeWolfe', 24);
    this.titleText.world.x += this.titleText.width;

    this.instructionText = this.game.add.bitmapText(180, Game.gameHeight/1.5,
      'spaceagefont', 'Click anywhere to begin', 24);

    this.sprite.angle = -180;
    this.game.add.tween(this.sprite).to({angle: 180}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],14:[function(require,module,exports){
  'use strict';
  // Includes
  var BaseEnemyShip = require('../prefabs/BaseEnemyShip');
  var BossEnemyShip = require('../prefabs/BossEnemyShip');
  var RogueEnemyShip = require('../prefabs/RogueEnemyShip');
  var PlayerShip = require('../prefabs/PlayerShip');
  var NavPoint = require('../prefabs/NavPoint');
  var BigLaserProjectile = require('../prefabs/BigLaserProjectile');
  var SmallLaserProjectile = require('../prefabs/SmallLaserProjectile');
  var MissileProjectile = require('../prefabs/MissileProjectile');

  function Play() {}
  Play.prototype = {
    create: function
  ()
  {
    this.game.input.maxPointers = 1;
    this.enemySpawnTime = 3000;
    this.lastEnemySpawn = 0;
    this.enemySpawnCount = 0;
    this.enemyShipTotal = 20;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.backgroundSprite = this.game.add.sprite(0, 0, 'backgroundSprite');
    this.backgroundSprite.scale.setTo(4.0);
    this.playerWeaponGroup = this.game.add.group();
    this.enemyWeaponGroup = this.game.add.group();
    // Setup player ship
    this.playerShip = new PlayerShip(this.game);
    this.bossShip = new BossEnemyShip(this.game, 0, 0, 'blueEnemyShip');

    this.bossShip.wasKilled();
    this.currentNavPoint = 0;
    // Stores standard ships (not paired to overlord)
    this.basicShipGroup = this.game.add.group();
    this.navPointGroup = this.game.add.group();

    this.setupNavPoints();
    this.setupShipGroups();

    this.setupKeys();
    this.hpText = this.game.add.text(20, 20, '',
      {font: '20px Arial', fill: '#ffffff'} );
    this.weaponText = this.game.add.text(this.game.width, 20, '',
      {font: '20px Arial', fill: '#ffffff'} );
    this.weaponText.setText('Weapon: Ion Cannon');
    this.weaponText.x = this.game.width - this.weaponText.width - 20;

    this.game.time.events.loop(Phaser.Timer.SECOND*2, this.spawnEnemy, this);
  },
  render: function()
  {
    this.game.debug.text("MS till next Spawn: " + this.game.time.events.duration.toFixed(0),
      this.game.width/3, this.game.height - 32);
  },
  spawnEnemy: function ()
  {
    // On 10th spawn, spawn a boss
    if (this.enemySpawnCount === 10) {
      if (this.bossShip.exists === false) {
        this.bossShip.spawn();
        this.bossSpawned();
      }
    }
   // Otherwise, spawn the next enemy in the shipgroup that is not already active
    else {
      for (var i = this.enemySpawnCount; i < this.enemyShipTotal; i++) {
        var temp = this.basicShipGroup.getAt(i);
        if (temp.exists === false) {
          temp.spawn();
          i = 21;
        }
      }
    }
    this.enemySpawnCount+=1;
    if (this.enemySpawnCount >= this.enemyShipTotal) {
      this.enemySpawnCount = 0;
    }
  },
  // Assign all minions to the boss now that he is active
  bossSpawned: function()
  {
    for (var i = 0; i < this.enemyShipTotal; i++) {
      var temp = this.basicShipGroup.getAt(i);
      if (temp.shipClass === 'minion') {
        if (temp.exists === true) {
          temp.seekBoss = true;
        }
      }
    }
  },
  // Place all ships into groups, set as inactive and position off screen
  setupShipGroups: function()  {
    for (var i = 0; i < this.enemyShipTotal; i++) {
      if (i === 11){
        this.basicShipGroup.add(this.bossShip);
      }
      else if (i%4==1) {
        // Setup all %3 positions for rogue ships
        var enemy = new RogueEnemyShip(this.game, 0, Game.gameHeight, 'greenEnemyShip',
          this.navPointGroup.getAt(this.currentNavPoint));
        // Increment navpoint target value, and reset to 0 if exceeding cap
        this.currentNavPoint += 1;
        if (this.currentNavPoint > 4) { this.currentNavPoint = 0; }
        enemy.wasKilled();
        this.basicShipGroup.add(enemy);
      }
      // Setup all other positions for base ships
      else
      {
        // Spawn an enemy to a target navpoint
        var enemy = new BaseEnemyShip(this.game, 0, Game.gameHeight, 'yellowEnemyShip',
          this.navPointGroup.getAt(this.currentNavPoint));
        enemy.bossShip = this.bossShip;
        // Increment navpoint target value, and reset to 0 if exceeding cap
        this.currentNavPoint += 1;
        if (this.currentNavPoint > 4) { this.currentNavPoint = 0; }
        enemy.wasKilled();
        this.basicShipGroup.add(enemy);
      }
    }

  },
    // Bind keys ahead of time to check flags during update
  setupKeys: function () {
    // Setup key listeners to be checked during update
    this.renderToggleKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.weapon1Key = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.weapon2Key = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.weapon3Key = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  },
    // Drop a few nav points onto the map
  setupNavPoints: function() {
    var navPoint = new NavPoint(this.game, 85, 85);
    this.navPointGroup.add(navPoint);
    navPoint = new NavPoint(this.game, Game.gameWidth/2, 85);
    this.navPointGroup.add(navPoint);
    navPoint = new NavPoint(this.game, Game.gameWidth /8, Game.gameHeight/2);
    this.navPointGroup.add(navPoint);
    navPoint = new NavPoint(this.game, Game.gameWidth/2, Game.gameHeight - 85);
    this.navPointGroup.add(navPoint);
    navPoint = new NavPoint(this.game, Game.gameWidth - 85, Game.gameHeight - 85);
    this.navPointGroup.add(navPoint);

    this.navPointGroup.visible = false;
  },
  // Update function, render new health value, check for weapon firing, check collision and do callbacks
  update: function() {
    if (this.playerShip.health < 1)
    {
      this.game.state.start('gameover');
    }

    this.hpText.setText('Health: ' + this.playerShip.health);

    if (this.game.input.activePointer.isDown)
    {
      this.fire();
    }
    if (this.renderToggleKey.justPressed(30)==true)
    {
      this.navPointGroup.visible = !this.navPointGroup.visible;
    }
    if (this.weapon1Key.justPressed(30)==true)
    {
      this.playerShip.currentWeapon = 1;
      this.weaponText.setText('Weapon: Ion Cannon');
      this.weaponText.x = this.game.width - this.weaponText.width - 20;
    }
    if (this.weapon2Key.justPressed(30)==true)
    {
      this.playerShip.currentWeapon = 2;
      this.weaponText.setText('Weapon: Flak Cannon');
      this.weaponText.x = this.game.width - this.weaponText.width - 20;
    }
    if (this.weapon3Key.justPressed(30)==true)
    {
      this.playerShip.currentWeapon = 3;
      this.weaponText.setText('Weapon: Ion Torpedo');
      this.weaponText.x = this.game.width - this.weaponText.width - 20;
    }

    this.basicShipGroup.forEach(this.checkEnemyFireControl, this);
    this.game.physics.arcade.overlap(this.playerWeaponGroup, this.basicShipGroup, this.enemyHit, null, this);
    this.game.physics.arcade.overlap(this.enemyWeaponGroup, this.playerShip, this.playerHit, null, this);
    this.game.physics.arcade.collide(this.basicShipGroup, this.basicShipGroup, null, null, this);
    this.game.physics.arcade.collide(this.basicShipGroup, this.bossShip, null, null, this);

  },
  // Maybe use this for cleaning up inactive ships in ship groups
  groupCleanUp: function(targetGroup)
  {

  },
  // Maybe use this for cleaning up inactive ships in ship groups
  minionRetarget: function()
  {
    for (var i = 0; i < this.enemyShipTotal; i++) {
      if (this.basicShipGroup.getAt(i).shipClass === 'minion') {
        this.basicShipGroup.getAt(i).seekBoss = false;
      }
    }
  },
  // Collision callback for player being hit by enemy weapons
  playerHit: function(ship, weapon)
  {
    weapon.kill();
    ship.health -= weapon.damage;
  },
  // Collision callback for enemies being hit by player weapons
  enemyHit: function(weapon, ship)
  {
    if (ship.shipClass === 'battleship'){
      ship.health -= 1;
      if (ship.health < 1)
      {
        this.bossShip.wasKilled();
        this.minionRetarget();
      }
    }
    else {
      ship.wasKilled();
    }
    weapon.kill();
  },
  checkEnemyFireControl: function(inShip)
  {
    console.log('fire check');
    if (inShip.canFire(this.game.time.now) === true)
    {
      if (inShip.getName() === 'minion')
      {
        var offX = Math.random(-10, 10);
        var offY = Math.random(-10, 10);
        var laser = new SmallLaserProjectile(this.game, inShip,
          this.playerShip.x, this.playerShip.y, 'blueLaser');
        this.enemyWeaponGroup.add(laser);
      }
      else if (inShip.getName() === 'rogue')
      {
        var weapon = new MissileProjectile(this.game, inShip, this.playerShip, 'greenLaser');
        this.enemyWeaponGroup.add(weapon);
        if (inShip.targetFound === true)
        {
          console.log('getting new target');
          // If the current nav target is this ships target, increment and assign
          if (inShip.target === this.navPointGroup.getAt(this.currentNavPoint))
          {
            this.currentNavPoint += 1;
            if (this.currentNavPoint > 4) { this.currentNavPoint = 0; }
            inShip.target = this.navPointGroup.getAt(this.currentNavPoint);
          }
          // Otherwise, assign target and then increment
          else
          {
            inShip.target = this.navPointGroup.getAt(this.currentNavPoint);
            this.currentNavPoint += 1;
            if (this.currentNavPoint > 4) { this.currentNavPoint = 0; }
          }
        }
      }
      else if (inShip.getName() === 'battleship')
      {
        var laser = new BigLaserProjectile(this.game, inShip,
          this.playerShip.x, this.playerShip.y, 'redLaser');
        this.enemyWeaponGroup.add(laser);
      }
    }

  },
  fire: function() {
    if (this.playerShip.CanFire() == true)
    {
      if (this.playerShip.currentWeapon == 1)
      {
        var laser = new BigLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x, this.game.input.activePointer.y, 'blueLaser');
        this.playerWeaponGroup.add(laser);
      }
      else if (this.playerShip.currentWeapon == 2)
      {
        var laser = new SmallLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x + 90, this.game.input.activePointer.y, 'redLaser');
        this.playerWeaponGroup.add(laser);
        var laser = new SmallLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x + 35, this.game.input.activePointer.y, 'redLaser');
        this.playerWeaponGroup.add(laser);
        var laser = new SmallLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x - 35, this.game.input.activePointer.y, 'redLaser');
        this.playerWeaponGroup.add(laser);
        var laser = new SmallLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x - 90, this.game.input.activePointer.y, 'redLaser');
        this.playerWeaponGroup.add(laser);
      }
      else if (this.playerShip.currentWeapon == 3)
      {
        var temp = this.basicShipGroup.getFirstAlive();
        if (!temp)
        {
          temp = this.bossShip;
        }
        var missle = new MissileProjectile(this.game, this.playerShip, temp, 'greenLaser');
        this.playerWeaponGroup.add(missle);
      }
    }
  }
  };

  module.exports = Play;

},{"../prefabs/BaseEnemyShip":2,"../prefabs/BigLaserProjectile":3,"../prefabs/BossEnemyShip":4,"../prefabs/MissileProjectile":5,"../prefabs/NavPoint":6,"../prefabs/PlayerShip":7,"../prefabs/RogueEnemyShip":8,"../prefabs/SmallLaserProjectile":10}],15:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {

    this.load.bitmapFont('spaceagefont', 'assets/font/spaceage.png', 'assets/font/spaceage.fnt');

    this.asset = this.add.sprite(Game.width/2,Game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
/*
    // Load up audio
    this.game.load.audio('bgMusic'    , 'assets/audio/DST-Blam.mp3');
    this.game.load.audio('splashSFX'  , 'assets/audio/Kayyy-Wave.mp3');
    this.game.load.audio('sparkleSFX' , 'assets/audio/Sparkle-Robinhood76.mp3');*/

    this.load.image('backgroundSprite', 'assets/black.png');
    this.load.image('playerShip', 'assets/playerShip.png');
    this.load.image('greenEnemyShip', 'assets/enemy_green.png');
    this.load.image('yellowEnemyShip', 'assets/enemy_yellow.png');
    this.load.image('blueEnemyShip', 'assets/enemy_blue.png');
    this.load.image('navPoint', 'assets/waypoint.png');

    this.load.atlasJSONHash('redLaser', 'assets/redLaserAnim.png', 'assets/redLaserAnim.json');
    this.load.atlasJSONHash('blueLaser', 'assets/blueLaserAnim.png', 'assets/blueLaserAnim.json');
    this.load.atlasJSONHash('greenLaser', 'assets/greenLaserAnim.png', 'assets/greenLaserAnim.json');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])