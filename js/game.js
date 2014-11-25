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
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],2:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var BaseEnemyShip = function(game, x, y, shipType, target) {
  Phaser.Sprite.call(this, game, x, y, shipType);

  // Store the starting X value for reset
  this.startingX = this.x;
  this.target = target;
  this.name = "enemyShip";
  this.arriveRadius = 25;
  this.arriveVelocity = 10;
  this.seekAcceleration = 15;
  this.arriveAcceleration = 5;
  this.maxVelocity = 30;
  this.fireRate = 300;
  this.nextFire = 0;
  this.withRange = false;
  this.anchor.setTo(0.5);
  // Enable physics
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.enable = true;
  this.body.allowGravity = false;
  this.body.setSize(this.width * 0.85, this.height * 0.85, 0, 0);
};

BaseEnemyShip.prototype = Object.create(Phaser.Sprite.prototype);
BaseEnemyShip.prototype.constructor = BaseEnemyShip;

/**
 * Updates the sprite every frame
 */
BaseEnemyShip.prototype.update = function()
{
  this.checkBounds();
  this.calculateSteering();

  this.rotation += 0.1;
  //this.setVelocity(this.moveSpeed); // Set the current ships velocity
};

BaseEnemyShip.prototype.canFire = function()
{
  if (this.game.time.now > this.nextShot) {
    this.fireRate = 200;
    this.nextFire = this.game.time.now + this.fireRate;
    return true;
  }
  else
  {
    return false;
  }
};

// Calculate target vector depending on steering pattern
BaseEnemyShip.prototype.calculateSteering = function()
{
  var x;
  var y;
  // Calculate velocity to target position
  x = this.target.body.position.x - this.body.position.x;
  y = this.target.body.position.y - this.body.position.y;

  var mag = Math.sqrt(x*x + y*y);
  // If enemy is with arrive radius, decrease speed
  if (mag < this.arriveRadius){
    x = this.normalizeValue(x, mag);
    y = this.normalizeValue(y, mag);
    x *= this.arriveAcceleration;
    y *= this.arriveAcceleration;
    this.withinRange = true;
  }
  // If enemy is not with arrive radius, continue applying
  // steering motion
  else {
    this.withinRange = false;
   // Clamp target vector to the max velocity
    if (mag > this.maxVelocity) {
      x = this.normalizeValue(x, mag);
      y = this.normalizeValue(y, mag);
      x *= this.maxVelocity;
      y *= this.maxVelocity;
    }
    // Subtract target vector from current velocity
    x -= this.body.velocity.x;
    y -= this.body.velocity.y;

    // Check if new target vector is beyond max acceleration of ship
    mag = Math.sqrt(x * x + y * y);
    // If it is, normalize and clamp to max acceleration value
    if (mag > this.maxAcceleration) {
      x = this.normalizeValue(x, mag);
      y = this.normalizeValue(y, mag);
      x *= this.seekAcceleration;
      y *= this.seekAcceleration;
    }
  }
  console.log(this.target.body.position.x);
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
 * Checks if ship is out of world bounds
 */
BaseEnemyShip.prototype.checkBounds = function()
{
  if (this.x < -this.width || this.x > Game.gameWidth)
  {
    // Change steering
  }
  if (this.y < -this.height || this.y > Game.gameHeight + this.height)
  {
    // Change steering
  }
};

/**
 * Resets the velocity, sprite & body X positions
 */
BaseEnemyShip.prototype.reset = function()
{
  this.kill();
  this.x = this.startingX;
  this.body.x = this.startingX;
}

/**
 * Renders ships' physics body
 */
BaseEnemyShip.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = BaseEnemyShip;

},{}],3:[function(require,module,exports){
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

  this.animations.add(type);
  this.animations.play(type, 20, true);

  // Enable physics
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.allowGravity = false;
  this.body.setSize(this.width*0.75, this.height*0.75, 0, 0);
  this.body.velocity.x = Math.sin(rotation) * 150;
  this.body.velocity.y = Math.cos(rotation) * 150;

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

// need to add in steering requisite
var NavPoint = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'navPoint');

  this.name = "navpoint";
  this.anchor.setTo(0.5);
  this.game.add.existing(this);
  // Enable physics
  game.physics.enable(this, Phaser.Physics.ARCADE);
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

},{}],5:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var PlayerShip = function(game) {
  Phaser.Sprite.call(this, game, Game.gameWidth/2, Game.gameHeight/2, 'playerShip');

  this.name = "player";
  this.health = 999;
  this.fireRate = 200;
  this.nextFire = 0;
  this.currentWeapon = 0;
  this.anchor.setTo(0.5);
  this.game.add.existing(this);
  // Enable physics
  game.physics.enable(this, Phaser.Physics.ARCADE);
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
PlayerShip.prototype.CanFire = function() {
  if (this.game.time.now > this.nextFire) {
    if (this.currentWeapon == 1) {
      this.fireRate = 600;
      this.nextFire = this.game.time.now + this.fireRate;
    }
    else if (this.currentWeapon == 2) {
      this.fireRate = 300;
      this.nextFire = this.game.time.now + this.fireRate;
    }
    else if (this.currentWeapon == 3) {
      this.fireRate = 900;
      this.nextFire = this.game.time.now + this.fireRate;
    }
    return true;
  }
  else {
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

},{}],6:[function(require,module,exports){
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

  this.animations.add(type);
  this.animations.play(type, 20, true);

  // Enable physics
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.allowGravity = false;
  this.body.setSize(this.width*0.75, this.height*0.75, 0, 0);
  this.body.velocity.x = Math.sin(rotation) * 250;
  this.body.velocity.y = Math.cos(rotation) * 250;

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

};

SmallLaserProjectile.prototype = Object.create(Phaser.Sprite.prototype);
SmallLaserProjectile.prototype.constructor = SmallLaserProjectile;

SmallLaserProjectile.prototype.update = function() {

};

module.exports = SmallLaserProjectile;

},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
  'use strict';
  // Includes
  var BaseEnemyShip = require('../prefabs/BaseEnemyShip');
  var PlayerShip = require('../prefabs/PlayerShip');
  var NavPoint = require('../prefabs/NavPoint');
  var BigLaserProjectile = require('../prefabs/BigLaserProjectile');
  var SmallLaserProjectile = require('../prefabs/SmallLaserProjectile');

  function Play() {}
  Play.prototype = {
    create: function
  ()
  {
    this.enemySpawnTime = 3000;
    this.lastEnemySpawn = 0;
    this.enemySpawnCount = 0;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.background = this.game.add.sprite(this.game, 0, 0, 'background');
    this.playerLaserGroup = this.game.add.group();
    this.enemyLaserGroup = this.game.add.group();
    // Setup player ship
    this.playerShip = new PlayerShip(this.game);
    this.currentNavPoint = 0;
    // Stores standard ships (not paired to overlord)
    this.basicShipGroup = this.game.add.group();
    this.navPointGroup = this.game.add.group();
    this.setupNavPoints();

    this.setupKeys();
    //this.sprite.events.onInputDown.add(this.clickListener, this);
  },

  spawnEnemy: function () {
    // Check if it is time to spawn an enemy
    if (this.game.time.now > this.lastEnemySpawn) {
      this.lastEnemySpawn = this.game.time.now + this.enemySpawnTime;
      // If so, check if this is the 6th enemy, which means spawn an overlord
      if (this.enemySpawnCount==6) {

      }
      // If neither of the other spawns, spawn a standard arrive type enemy
      else {
        // Spawn an enemy to a target navpoint
        var enemy = new BaseEnemyShip(this.game, 20, Game.gameHeight - 20, 'yellowEnemyShip',
          this.navPointGroup.getAt(this.currentNavPoint));
        // Increment navpoint target value, and reset to 0 if exceeding cap
        this.currentNavPoint += 1;
        if (this.currentNavPoint > 3) { this.currentNavPoint = 0; }
        enemy.setAcceleration(2, 0);
        this.basicShipGroup.add(enemy);
      }
    }

  },
  setupKeys: function () {
    this.renderToggleKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.weapon1Key = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.weapon2Key = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.weapon3Key = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  },
  setupNavPoints: function() {
    var navPoint = new NavPoint(this.game, 85, 85);
    this.navPointGroup.add(navPoint);
    navPoint = new NavPoint(this.game, Game.gameWidth - 100, Game.gameHeight - 100);
    this.navPointGroup.add(navPoint);
    var navPoint = new NavPoint(this.game, Game.gameWidth/2, 100);
    this.navPointGroup.add(navPoint);
    navPoint = new NavPoint(this.game, Game.gameWidth - 75, 200);
    this.navPointGroup.add(navPoint);
  },
  update: function() {

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
    }
    if (this.weapon2Key.justPressed(30)==true)
    {
      this.playerShip.currentWeapon = 2;
    }
    if (this.weapon3Key.justPressed(30)==true)
    {
      this.playerShip.currentWeapon = 3;
    }

    this.spawnEnemy();
    this.game.physics.arcade.collide(this.playerLaserGroup, this.basicShipGroup, this.enemyHit, null, this)
    this.game.physics.arcade.collide(this.basicShipGroup, this.basicShipGroup, this.enemyHit, null, this);
  },
  enemyHit: function() {

  },
  fire: function() {
    if (this.playerShip.CanFire() == true) {
      if (this.playerShip.currentWeapon == 1) {
        var laser = new BigLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x, this.game.input.activePointer.y, 'blueLaser');
        this.playerLaserGroup.add(laser);
      }
      else if (this.playerShip.currentWeapon == 2) {
        var laser = new SmallLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x+64, this.game.input.activePointer.y, 'redLaser');
        this.playerLaserGroup.add(laser);
        var laser = new SmallLaserProjectile(this.game, this.playerShip,
          this.game.input.activePointer.x-64, this.game.input.activePointer.y, 'redLaser');
        this.playerLaserGroup.add(laser);
      }
      else if (this.playerShip.currentWeapon == 3) {

      }
    }
  },

  clickListener: function() {
    this.game.state.start('gameover');
  }
  };

  module.exports = Play;

},{"../prefabs/BaseEnemyShip":2,"../prefabs/BigLaserProjectile":3,"../prefabs/NavPoint":4,"../prefabs/PlayerShip":5,"../prefabs/SmallLaserProjectile":6}],11:[function(require,module,exports){

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

    this.load.image('background', 'assets/black.png');
    this.load.image('playerShip', 'assets/playerShip.png');
    this.load.image('redEnemyShip', 'assets/enemy_red.png');
    this.load.image('yellowEnemyShip', 'assets/enemy_yellow.png');
    this.load.image('orangeEnemyShip', 'assets/enemy_orange.png');
    this.load.image('navPoint', 'assets/waypoint.png');

    this.load.atlasJSONHash('redLaser', 'assets/redLaserAnim.png', 'assets/redLaserAnim.json');
    this.load.atlasJSONHash('blueLaser', 'assets/blueLaserAnim.png', 'assets/blueLaserAnim.json');
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