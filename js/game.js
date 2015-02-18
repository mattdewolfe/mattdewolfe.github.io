(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(Game.gameWidth, Game.gameHeight, Phaser.AUTO, 'canvas1');

  // Game States
  game.state.add('accountEvaluation', require('./states/accountEvaluation'));
  game.state.add('accountLogin', require('./states/accountLogin'));
  game.state.add('accountTreatment', require('./states/accountTreatment'));
  game.state.add('bactoMenu', require('./states/bactoMenu'));
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('mealMenu', require('./states/mealMenu'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('playBacto', require('./states/playBacto'));
  game.state.add('playMeal', require('./states/playMeal'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('tracker', require('./states/tracker'));
  

  game.state.start('boot');
};
},{"./states/accountEvaluation":13,"./states/accountLogin":14,"./states/accountTreatment":15,"./states/bactoMenu":16,"./states/boot":17,"./states/gameover":18,"./states/mealMenu":19,"./states/menu":20,"./states/play":21,"./states/playBacto":22,"./states/playMeal":23,"./states/preload":24,"./states/tracker":25}],2:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var HexTile = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'Sprite_ClearedHex');
;
  this.game.add.existing(this);
  // Enable physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.allowGravity = true;
  this.body.collideWorldBounds = true;
  this.body.gravity.y = Math.floor((Math.random() * 20) + 1);
  this.body.gravity.x = Math.floor((Math.random() * 20) + 1);
  this.body.bounce.x = 1;
  this.body.bounce.y = 1;
};

HexTile.prototype = Object.create(Phaser.Sprite.prototype);
HexTile.prototype.constructor = HexTile;

/**
 * Updates the sprite every frame
 */
HexTile.prototype.update = function()
{

};

HexTile.prototype.toggleRender = function()
{
  this.visibibility = !this.visibility;
}
/**
 * Render the waypoint to screen
 */
HexTile.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = HexTile;

},{}],3:[function(require,module,exports){
'use strict';

var BactoSurfer = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bactoSurferPack', 'bactoSurfer');

  this.anchor.setTo(0.5, 0.5);

  this.name = 'bactoSurfer';
  this.alive = false;
  this.moveSpeed = Game.speed;

  // Enable physics and disable gravity until start of game
  this.game.physics.arcade.enableBody(this);
  this.game.add.existing(this);
  this.body.allowGravity = false;
  this.body.setSize(this.width * 0.55, this.height * 0.80, 0, 0);
};

BactoSurfer.prototype = Object.create(Phaser.Sprite.prototype);
BactoSurfer.prototype.constructor = BactoSurfer;

/**
 * Initializes the sprite body 
 */
BactoSurfer.prototype.init = function()
{  
  this.body.allowGravity = true;
  this.alive = true;
}

/**
 * Updates the player every frame
 */
BactoSurfer.prototype.update = function() 
{
	if(this.alive)
	{
    if (this.body.touching.down || this.body.touching.up)
    {
      this.body.velocity.x = this.moveSpeed;
    }
    else
    {
      this.body.velocity.x = 0;
    }

    this.flip();
	}
  else
  {
    this.body.velocity.x = 0;
  }  
};

/**
 * Flips the player sprite 
 */
BactoSurfer.prototype.flip = function()
{
  if (this.game.physics.arcade.gravity.y < 0)
  {
    this.scale.y = -1;
  }
  else if (this.game.physics.arcade.gravity.y > 0)
  {
    this.scale.y = 1;
  } 
}

/**
 * Renders BactoSurfer's physics body
 */
BactoSurfer.prototype.render = function()
{
    this.game.debug.body(this);
}

module.exports = BactoSurfer;

},{}],4:[function(require,module,exports){
'use strict';

var Germ = function(game, x, y, germType, frame) {
  Phaser.Sprite.call(this, game, x, y, germType, frame);

  // initialize your prefab here
  this.animations.add('move');
  this.animations.play('move', 20, true);

  // Store the starting X value for reset
  this.startingX = this.x;

  this.name = "germ";
  this.moveSpeed = -Game.speed;

  // Enable physics
  game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.setSize(this.width * 0.5, this.height * 0.5, this.width * 0.25, this.height * 0.25);
};

Germ.prototype = Object.create(Phaser.Sprite.prototype);
Germ.prototype.constructor = Germ;

/**
 * Updates the sprite every frame
 */
Germ.prototype.update = function() 
{
  if (this.alive)
  {
    this.checkBounds();
    this.setVelocity(this.moveSpeed); // Set the current germs velocity
  }
  else
  {
    this.kill();
  }
};

/**
 * Sets body's velocity
 * @param {Number} moveSpeed
 */
Germ.prototype.setVelocity = function(moveSpeed)
{
	this.body.velocity.x = moveSpeed;
};

/**
 * Checks if germ is out of world bounds
 */
Germ.prototype.checkBounds = function()
{
	if (this.x < -this.width)
	{
		this.kill();
		this.setVelocity(0);
    this.x = this.startingX;
	}
};

/**
 * Resets the velocity, sprite & body X positions
 */
Germ.prototype.reset = function()
{
  this.kill();
  this.setVelocity(0);
  this.x = this.startingX;
  this.body.x = this.startingX;
}

/**
 * Renders germs' physics body
 */
Germ.prototype.render = function()
{

};

module.exports = Germ;
},{}],5:[function(require,module,exports){
'use strict';

var Powerup = function(game, x, y, frame, powerUpName) {
  Phaser.Sprite.call(this, game, x, y, 'bactoSurferPack', powerUpName);

  // initialize your prefab here
  // Name of the power up for collision detection
  this.name = powerUpName;

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.setSize(this.width * 0.75, this.height * 0.75, this.width * 0.125, this.height * 0.125);

  // Set motion type
  this.motionType = Math.random();
  if (this.motionType <= 0.60)
  {
  	this.isSinusoidal = false;
  }
  else
  {
  	this.isSinusoidal = true;
  }

  // Set speed multiplier
  var randMultiplier = 0.75 + (0.90 - 0.75) * Math.random();
  this.body.velocity.x = -Game.speed * randMultiplier;

  this.numberOfTicks = 0;
};

Powerup.prototype = Object.create(Phaser.Sprite.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.update = function()
{
	if (this.checkBounds())
	{
		this.destroy();
	}

	// Sinusoidal motion
	if (this.isSinusoidal)
	{
		this.numberOfTicks++;
    	this.y = (100 * Math.sin(this.numberOfTicks * 0.5 * Math.PI / 60)) + 350;
	}
}	

Powerup.prototype.checkBounds = function()
{
	if (this.x <= -this.width)
	{
		return true;
	}
}

Powerup.prototype.render = function()
{
	this.game.debug.body(this);
}

module.exports = Powerup;
},{}],6:[function(require,module,exports){
'use strict';

var PowerupFX = function(game, x, y, effect, frame) {
  Phaser.Sprite.call(this, game, x, y, effect, frame);

  this.animations.add('animate');

  this.name = effect;

  if (this.name === "toothpasteEffect")
  {
  	this.animations.play('animate', 30, true, false);
  }
  else
  {
  	this.animations.play('animate', 30, false, true);
  }
};

PowerupFX.prototype = Object.create(Phaser.Sprite.prototype);
PowerupFX.prototype.constructor = PowerupFX;

PowerupFX.prototype.update = function()
{
	if (this.animations.currentAnim.loopCount >= 3)
	{
		this.destroy();
	}
}

module.exports = PowerupFX;

},{}],7:[function(require,module,exports){
'use strict';

var Scoreboard = function(game) 
{    
  var gWidth = game.width;
  var gHeight = game.height;
  Phaser.Group.call(this, game);

  this.gameover = this.create(gWidth * 0.50, gHeight * 0.25, 'bactoSurferPack', 'gameover');
  this.gameover.anchor.setTo(0.5, 0.5);
 
  this.scoreboard = this.create(gWidth * 0.425, gHeight * 0.475, 'scoreboard');
  this.scoreboard.anchor.setTo(0.5, 0.5);

  // Score text
  this.scoreText = this.game.add.text(gWidth * 0.5 + this.scoreboard.width * 0.6, 
    gHeight * 0.373, '0', { font: Game.fontSize, fill: '#FFFFFF'});
  this.add(this.scoreText);

  this.bestText = this.game.add.text(gWidth * 0.5 + this.scoreboard.width * 0.6, 
    gHeight * 0.50, '0', { font: Game.fontSize, fill: '#FFFFFF'});
  this.add(this.bestText);

  // add our start button with a callback
  var startButton = this.game.add.button(gWidth * 0.33, gHeight * 0.7, 
    'buttonPack', this.startClick, this);
  startButton.frameName = 'startbutton';
  startButton.anchor.setTo(0.5,0.5);

  var exitButton = this.game.add.button(gWidth * 0.66, gHeight * 0.7, 
    'buttonPack', this.exitClick, this);
  exitButton.frameName = 'exitbutton';
  exitButton.anchor.setTo(0.5,0.5);

  this.add(startButton);
  this.add(exitButton);

  this.y = gHeight;
  this.x = 0;  
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) 
{
  var coin = null;
  var bestScore = 0;

  this.scoreText.setText(score.toString());

  if(!!localStorage) 
  {
    bestScore = localStorage.getItem('bestScore'+this.game.state.current);
    if(!bestScore || bestScore < score) 
    {
      bestScore = score;
      localStorage.setItem('bestScore'+this.game.state.current, bestScore);
    }
  } 
  else 
  {
    bestScore = 'N/A';
  }

  this.bestText.setText(bestScore.toString());

  if (score < 50)
  {
    coin = this.game.add.sprite(this.gameover.width * -0.227, this.gameover.height * 0.44, 'medal', 0);
  }
  else if(score >= 50 && score < 100)
  {
    coin = this.game.add.sprite(this.gameover.width * -0.227, this.gameover.height * 0.44, 'medal', 1);
  } 
  else if(score >= 100 && score < 250) 
  {
    coin = this.game.add.sprite(this.gameover.width * -0.227, this.gameover.height * 0.44, 'medal', 2);
  }
  else if (score >= 250)
  {
    coin = this.game.add.sprite(this.gameover.width * -0.227, this.gameover.height * 0.44, 'medal', 3);
  }

  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

  if (coin) 
  {    
    coin.anchor.setTo(0.5, 0.5);
    this.scoreboard.addChild(coin); 
  }

};

Scoreboard.prototype.startClick = function() {
  this.game.state.start(this.game.state.current);
};

Scoreboard.prototype.exitClick = function() {
  this.game.state.start('menu');
};

module.exports = Scoreboard;

},{}],8:[function(require,module,exports){
'use strict';

var SkyLine = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'mealTimePack', frame);
  
};

SkyLine.prototype = Object.create(Phaser.Sprite.prototype);
SkyLine.prototype.constructor = SkyLine;

SkyLine.prototype.update = function() {
  this.angle -= 0.25;
};

module.exports = SkyLine;

},{}],9:[function(require,module,exports){
'use strict';

var SlideOutMenu = function(game, parent) 
{
	Phaser.Group.call(this, game, parent);

	var offset;

	this.isVisible = false;

	// add button for evaluation
  	var button = this.game.add.button(0, 0, 'slideoutMenuPack', this.evalClick, this);
  	button.frameName = 'evaluation';
  	button.width *= Game.skewX;
  	button.height *= Game.skewY;
	button.y = button.height;
	button.anchor.setTo(0.5, 0.5);
	offset = button.y;
	this.add(button);

	// add blank element for 'input' event to register clicking outside menu
	// this is added afte the first button so we can store the values of each buttons
	// width to use in the blank space
	var blankX = -button.width;
	var blankWidth = button.width*0.25;
	button = this.game.add.button(blankX, this.game.height*0.5, null, this.hide, this);
	button.width = blankWidth;
	button.height = this.game.height - button.height;
	button.anchor.setTo(0.5, 0.5);
	this.add(button);

	// add button to take user to treatment screen
	button = this.game.add.button(0, 0, 'slideoutMenuPack', this.treatmentPlanClick, this);
	button.frameName = 'treatment';
	button.width *= Game.skewX;
  	button.height *= Game.skewY;
	button.y = offset + button.height;
	button.anchor.setTo(0.5, 0.5);
	offset = button.y;
	this.add(button);

	// add buton to take user to trophy screen - NOTE this is named wrong in JSON for texture atlas
	button = this.game.add.button(0, 0, 'slideoutMenuPack', this.trophyClick, this);
	button.frameName = 'changePassword';
	button.width *= Game.skewX;
  	button.height *= Game.skewY;
	button.y = offset + button.height;
	button.anchor.setTo(0.5, 0.5);
	offset = button.y;
	this.add(button);

	// add button for logging out
	button = this.game.add.button(0, 0, 'slideoutMenuPack', this.logoutClick, this);
	button.frameName = 'logout';
	button.width *= Game.skewX;
  	button.height *= Game.skewY;
	button.y = offset + button.height;
	button.anchor.setTo(0.5, 0.5);
	// add an extra buttons height before putting bottom block onto slideout menu
	offset = button.y + (button.height*0.5);
	this.add(button);

	// add blank bottom section 
	button = this.game.add.button(0, 0, 'slideoutMenuPack', this.slideOut, this);
	button.frameName = 'bottomBlock';
	button.width *= Game.skewX;
  	button.height *= Game.skewY;
	button.y = offset + (button.height*0.5);
	button.anchor.setTo(0.5, 0.5);
	this.add(button);
	
	// store buttonWidth for tweening on/off screen
	this.buttonWidth = button.width;
	this.x = this.game.width + button.width;
};

SlideOutMenu.prototype = Object.create(Phaser.Group.prototype);
SlideOutMenu.prototype.constructor = SlideOutMenu;
  
SlideOutMenu.prototype.evalClick = function() {
    if (this.game.state.current !== 'accountEvaluation') {
    	this.game.state.start('accountEvaluation');
    }
    else {
    	this.hide();
    }
};

SlideOutMenu.prototype.treatmentPlanClick = function() {
    if (this.game.state.current !== 'accountTreatment') {
    	this.game.state.start('accountTreatment');
    }
    else {
    	this.hide();
    }
};

SlideOutMenu.prototype.trophyClick = function() {
    if (this.game.state.current !== 'tracker') {
    	this.game.state.start('tracker');
    }
    else {
    	this.hide();
    }
};

SlideOutMenu.prototype.logoutClick =  function() {
    // logout call should change internal login values, clear storage
    // and reset localStorage default values as needed - then return user to menu
    if (Game.loggedIn === true) {
    	Game.userName = '!';
    	Game.passWord = '!';
    	Game.loggedIn = false;
    	localStorage.clear();
    	localStorage.setItem("email", "");
    	localStorage.setItem("password", "");
    	localStorage.setItem("loggedIn", "false");
    	localStorage.setItem("points", "0");
    	this.game.state.start('menu');
    }
    else {
    	this.hide();
    }
};
SlideOutMenu.prototype.hide = function() {
	if (this.isVisible === true) {
		this.game.add.tween(this).to({x: this.game.width + this.buttonWidth}, 600, null, true);
		this.isVisible = false;
	}
};
SlideOutMenu.prototype.slideOut = function() {
	if (this.isVisible === false) {
		this.game.add.tween(this).to({x: this.game.width - this.buttonWidth/2}, 600, null, true);
		this.isVisible = true;
	}
	else {
		this.game.add.tween(this).to({x: this.game.width + this.buttonWidth}, 600, null, true);
		this.isVisible = false;
	}
};
module.exports = SlideOutMenu;

},{}],10:[function(require,module,exports){
'use strict';

var Snack = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'food', frame);
  this.snackType = frame;
  this.clicked = false;
  this.inputEnabled = true;
  this.events.onInputDown.add(this.picked, this);

  this.feedback = this.game.add.sprite((this.game.width * 0.5),
   (this.game.height * 0.33), 'textFeedback');
  this.feedback.visible = false;
  this.feedbackStartY = this.feedback.y;
  this.feedback.x -= this.feedback.width * 0.5;

  this.startX = this.x;
  this.xSpeed = this.game.width*0.008;
};

Snack.prototype = Object.create(Phaser.Sprite.prototype);
Snack.prototype.constructor = Snack;

Snack.prototype.update = function() {
  if(this.feedback.visible === true) {
    this.feedback.y -= 3;
  }
  if (this.feedback.y < this.game.height*0.1) {
    this.feedback.visible = false;
  }
  if (this.clicked === false && this.x > this.game.width*0.4) {
    this.x -= this.xSpeed;
  }
  else {
    this.exists = false;
  }
};
Snack.prototype.resetSnack = function() {
  this.clicked = false;
  this.visible = true;
  this.exists = true;
};
Snack.prototype.picked = function() {
	/* Audio commented out for the moment */
  
  this.clicked = true;
  this.exists = false;
  if (this.snackType < 8) {
    this.feedback.frame = 1;
  //  sound = this.game.add.audio('goodChoice');
  }
  else {
    this.feedback.frame = 0;
  //  sound = this.game.add.audio('badChoice');
  }
  //sound.play();
  this.feedback.y = this.feedbackStartY;
  this.feedback.visible = true;
};

module.exports = Snack;

},{}],11:[function(require,module,exports){
'use strict';

// Hi :)

var Tooth = require('./tooth');

var TeethGroup = function(game, parent) 
{
	Phaser.Group.call(this, game, parent);
	var gHeight = this.game.height;

	// Spawn initial amount of teeth to start the game
	for (var i = 0; i < 11; ++i) 
	{
		// Initialize a top tooth
		this.topTooth = new Tooth(this.game, 0, 0, 1);

		// Set the position & rotation of each top tooth
		this.topTooth.x = this.topTooth.width * i;
		this.topTooth.y = this.topTooth.height / 2;
		this.topTooth.angle = 180;
		this.add(this.topTooth);		
	};

	for (var i = 0; i < 11; ++i) 
	{			
		// Initialize a bottom tooth
		this.bottomTooth = new Tooth(this.game, 0, 0, 1);

		// Position the bottom tooth
		this.bottomTooth.x = this.topTooth.width * i;
		this.bottomTooth.y = gHeight - this.topTooth.height / 2;
		this.add(this.bottomTooth);	
	};
};

TeethGroup.prototype = Object.create(Phaser.Group.prototype);
TeethGroup.prototype.constructor = TeethGroup;

TeethGroup.prototype.stop = function()
{
	this.setAll('body.velocity.x', 0);
}

module.exports = TeethGroup;

// Bye :(
},{"./tooth":12}],12:[function(require,module,exports){
'use strict';

var Tooth = function(game, x, y, frame, rotation) 
{
	Phaser.Sprite.call(this, game, x, y, 'tooth', frame);
  
	this.anchor.setTo(0.5, 0.5);
	// initialize your prefab here
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = false;
	this.body.immovable = true;
	
	this.animations.add('toothHeal');

	this.isClean = 0;
	this.pointValue = 1;

	this.xRespawnPos = this.game.width + this.width;
	// The game speed is set in index.html
	this.body.velocity.x = -Game.speed;
};

Tooth.prototype = Object.create(Phaser.Sprite.prototype);
Tooth.prototype.constructor = Tooth;

/**
 * Updates the sprite every frame
 */
Tooth.prototype.update = function() 
{
	// Check out of bounds
	if (this.x < Math.floor(-this.width * 0.5))
	{
		this.resetTooth();
	}
};

/**
 * Resets tooth sprite's X position, clean flag and current frame
 */
Tooth.prototype.resetTooth = function()
{	
	this.x += this.xRespawnPos;
	this.isClean = 0;
	this.animations.frame = 0;
};

/**
 * Sets clean flag and plays animation
 */
Tooth.prototype.cleanTooth = function()
{
	this.isClean = 1;
	this.animations.play('toothHeal', 20, false);
};

/**
 * Renders tooth's physics body
 */
Tooth.prototype.render = function()
{
    this.game.debug.body(this);
};

module.exports = Tooth;
},{}],13:[function(require,module,exports){
'use strict';

var SlideOutMenu = require('../prefabs/slideOutMenu');

// This state displays the users evaluation
  function AccountEvaluation() {}
  AccountEvaluation.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
      this.scale.forceOrientation(true, false);

      var gWidth = this.game.width;
      var gHeight = this.game.height;

      this.game.stage.backgroundColor = 0x78C0B1;
      this.buttons = this.game.add.group();

      // add the app bar across top
      var button = this.game.add.sprite(0, 0, 'buttonPack', 'appbar');
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      this.buttons.add(button);

      // add placeholder image for this state
      this.placeholder = this.game.add.sprite(0, 0, 'evaluationScreen');
      this.placeholder.width *= Game.skewX;
      this.placeholder.height *= Game.skewY;
      // minor offset for placement of placehold graphics in landscape
      if (Game.orientation === 'landscape') {
        this.placeholder.y = gHeight*0.6; 
      }
      else {
        this.placeholder.y = gHeight*0.5; 
      }
      this.placeholder.x = gWidth*0.5;
      this.placeholder.anchor.setTo(0.5, 0.5);

      // add background image
      this.logo = this.game.add.sprite(this.game.width*0.5, 0, 'logo');
      this.logo.width *= Game.skewX;
      this.logo.height *= Game.skewY;
      this.logo.y = this.logo.height*0.6;
      this.logo.anchor.setTo(0.5, 0.5);

      // add the hamburger button to open slideout menu
      button = this.game.add.button(0, 0, 'buttonPack', this.slideOut, this);
      button.frameName = 'hamburgerbutton';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = button.height;
      button.x = gWidth - button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);

      button = this.game.add.button(0, 0, 'buttonPack', this.exitClick, this);
      button.frameName = 'backbutton';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = button.height;
      button.x = button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);

      this.menu = new SlideOutMenu(this.game);

    },
    update: function() {

    },
    exitClick: function() {
      this.game.state.start('menu');
    },
    slideOut: function() {
      this.menu.slideOut();
    }, 
    shutdown: function() {
      this.buttons.destroy();
      this.placeholder.destroy();
    },
  };
module.exports = AccountEvaluation;

},{"../prefabs/slideOutMenu":9}],14:[function(require,module,exports){
'use strict';

  function AccountLogin() {}
  AccountLogin.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
      var gWidth = this.game.width;
      var gHeight = this.game.height;

      this.game.stage.backgroundColor = 0x78C0B1;
      
      // add the app bar across top
      this.button = this.game.add.sprite(0, 0, 'buttonPack', 'appbar');
      this.button.width *= Game.skewX;
      this.button.height *= Game.skewY;
      
      // add background image
      this.logo = this.game.add.sprite(this.game.width*0.5, 0, 'logo');
      this.logo.width *= Game.skewX;
      this.logo.height *= Game.skewY;
      this.logo.y = this.logo.height*0.6;
      this.logo.anchor.setTo(0.5, 0.5);

      // setup login screen
      Game.loginAttempt = false;
      Game.loginCancelled = false;
      Game.userNameEntered = false;
      Game.passWordEntered = false;
      Game.loginComplete = false;

      if (this.game.device.cocoonJS === true) {
        // add cocoon event listeners for after user has entered info
        CocoonJS.App.onTextDialogFinished.addEventListener(
            function(text)
            {
              console.log('fired login event');
              // check our login flag - this prevents this event from triggering multiple
              // times, which is does natively. Unsure why.
              if (Game.loginAttempt === true) {
                Game.loginAttempt = false;
                // if they entered an email address, then store username
                if (Game.userNameEntered === false) {
                  console.log('saved username');
                  Game.userName = text;
                  Game.userNameEntered = true;
                  localStorage.email = Game.userName;
                }
                else if (Game.passWordEntered === false) {
                  console.log('saved password');
                  Game.passWord = text;
                  Game.passWordEntered = true;
                  localStorage.password = Game.passWord;
                }
              }
            }
        );
        // if they cancel, then return to main menu
        CocoonJS.App.onTextDialogCancelled.addEventListener(
            function()
            {
                Game.loginCancelled = true;
                Game.loginAttempt = false;
            }
        );
      }
    },
    update: function() {
      // check if game is ready processing a login, and the user has not cancelled input
      if (Game.loginAttempt === false && Game.loginCancelled === false) {
        // if it is not, check if the username and password have been entered
        if (Game.userNameEntered === true && Game.passWordEntered === true) {
          // if they have, query server for user account
          this.queryServer();
        }
        // if they have not, call login attempt method
        else {
          this.loginAttempt();
        }
      }
      // if the user has cancelled input at one menu, then exit account screen
      else if (Game.loginCancelled === true) {
        this.exitClick();
      }
      // lastly, if the ajax script has changed the login flag, 
      // then update loggedIn // state and return to main menu
      else if (Game.loginComplete === true) {
         console.log('login attempt-userID: '+localStorage.userid);
        // if server loaded info to local storage and userid is different, log in was successful
        if (localStorage && localStorage.userid !== "!") {
          Game.loggedIn = true;
        }
        else {
          Game.loggedIn = false;
        }
        localStorage.loggedIn = Game.loggedIn;
        this.game.state.start('menu');
      }
    }, 
    loginAttempt: function() {
      // change game login flag to true, reset to false in DialogFinished event in CocoonJS
      Game.loginAttempt = true;
      // ensure user app is running in cocoonJS
      if (this.game.device.cocoonJS === true) {
        // if username has not been entered, prompt with input window for email
        if (Game.userNameEntered === false) {
          CocoonJS.App.showTextDialog( "Username", "Enter your email address", localStorage.email, 
            CocoonJS.App.KeyboardType.EMAIL, "Cancel", "Enter" );
        } 
        // if username has been entered, prompt with window for password
        else if (Game.passWordEntered === false) {
        CocoonJS.App.showTextDialog( "Password", "Enter your password", localStorage.password, 
          CocoonJS.App.KeyboardType.TEXT, "Cancel", "Login" );
        }
      }
    },
    // send login info to server to attempt a login
    queryServer: function() {
      // set userid to garbage value
      localStorage.userid = "!";
      // set login time out flags for state to wait until loginComplete is true
      // before executing any other code
      Game.loginComplete = false;
      Game.loginAttempt = true;
      // create new instance of login
      var login = new r2c.Login();
      // call login
      login.doLogin();
     
     
    },
    exitClick: function() {
      this.game.state.start('menu');
    },
    shutdown: function() {
      this.button.destroy();
      this.logo.destroy();
    },
  };
module.exports = AccountLogin;

},{}],15:[function(require,module,exports){
'use strict';

var SlideOutMenu = require('../prefabs/slideOutMenu');

// This state displays the users treatment plan
  function AccountTreatment() {}
  AccountTreatment.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
      this.scale.forceOrientation(true, false);

      var gWidth = this.game.width;
      var gHeight = this.game.height;

      this.game.stage.backgroundColor = 0x78C0B1;
      this.buttons = this.game.add.group();

      // add the app bar across top
      var button = this.game.add.sprite(0, 0, 'buttonPack', 'appbar');
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      this.buttons.add(button);

      // add placeholder image for this state
      this.placeholder = this.game.add.sprite(0, 0, 'treatmentScreen');
      this.placeholder.width *= Game.skewX;
      this.placeholder.height *= Game.skewY;
      // minor offset for placement of placehold graphics in landscape
      if (Game.orientation === 'landscape') {
        this.placeholder.y = gHeight*0.58; 
      }
      else {
        this.placeholder.y = gHeight*0.5; 
      }
      this.placeholder.x = gWidth*0.5;
      this.placeholder.anchor.setTo(0.5, 0.5);

      // add background image
      this.logo = this.game.add.sprite(this.game.width*0.5, 0, 'logo');
      this.logo.width *= Game.skewX;
      this.logo.height *= Game.skewY;
      this.logo.y = this.logo.height*0.6;
      this.logo.anchor.setTo(0.5, 0.5);

      // add the hamburger button to open slideout menu
      button = this.game.add.button(0, 0, 'buttonPack', this.slideOut, this);
      button.frameName = 'hamburgerbutton';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = button.height;
      button.x = gWidth - button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);

      button = this.game.add.button(0, 0, 'buttonPack', this.exitClick, this);
      button.frameName = 'backbutton';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = button.height;
      button.x = button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);

      this.menu = new SlideOutMenu(this.game);

    },
    update: function() {

    },
    exitClick: function() {
      this.game.state.start('menu');
    },
    slideOut: function() {
      this.menu.slideOut();
    }, 
    shutdown: function() {
      this.buttons.destroy();
      this.placeholder.destroy();
    },
  };
module.exports = AccountTreatment;

},{"../prefabs/slideOutMenu":9}],16:[function(require,module,exports){
'use strict';

function BactoMenu() {}

BactoMenu.prototype = {
  preload: function()
  {
    /** 
     * Loads all audio 
     * Can NOT be done at Preload STATE because of CocoonJS bug
     * requiring touch input before audio can load properly)
     */
    /*this.game.load.audio('bgMusic'    , '/assets/audio/DST-Blam.mp3');
    this.game.load.audio('splashSFX'  , '/assets/audio/Kayyy-Wave.wav');
    this.game.load.audio('sparkleSFX' , '/assets/audio/Sparkle-Robinhood76.wav');
    this.game.load.audio('gameOverSFX', '/assets/audio/Benboncan-SadTrombone.wav');*/
  },
  
  create: function() 
  {
    this.scale.forceOrientation(true, false);

    this.game.stage.backgroundColor = 0x78C0B1;
    
    var gWidth = this.game.width;
    var gHeight = this.game.height;
    // Add the background sprite
    this.menu = this.game.add.group();
    image = this.game.add.sprite(0, 0, 'bactoBackgrounds', 'background_title');
    this.menu.add(image);

    // Play Button
    var image = this.game.add.button(gWidth * 0.5, gHeight * 0.8, 'buttonPack', this.startClick, this);
    image.frameName = 'playbutton';
    image.anchor.setTo(0.5, 0.5);
    this.menu.add(image);

    // visuals of surfers on background
    var leftSurfer = this.game.add.sprite(0, gHeight * 0.50, 'bactoSurferPack', 'leftSurfer');
    this.menu.add(leftSurfer);
    var rightSurfer = this.game.add.sprite(gWidth * 0.75, gHeight * 0.50, 'bactoSurferPack', 'rightSurfer');
    this.menu.add(rightSurfer); 

     // add exit button
    this.backButton = this.game.add.button(0, 0, 'buttonPack', this.exitClick, this);
    this.backButton.frameName = 'backbutton'
    this.backButton.y = this.backButton.height;
    this.backButton.x = this.backButton.width;
    this.backButton.anchor.setTo(0.5, 0.5);

    // define image for forced rotation message
    this.rotate = this.game.add.sprite(gWidth*0.5, gHeight*0.5, 'rotateImage');
    this.rotate.anchor.setTo(0.5, 0.5);
    this.rotate.visible = false;
    if (window.orientation === 0) {
      this.rotate.visible = true;
      this.game.paused = true;
    }

  },

  startClick: function() 
  {
    this.awardPoints();
    this.game.state.start('playBacto');
  },
  exitClick: function() {
    this.game.state.start('menu');
  },
  pauseUpdate: function() {
    if (window.orientation !== 0) {
      this.game.paused = false;
      this.rotate.visible = false;
    }
  },
  update: function() {
    if (window.orientation === 0) {
      this.game.paused = true;
      this.rotate.visible = true;
    }
  },
  awardPoints: function() {
    //var points = new r2c.Points();
    //points.updatePoints();
  },
  shutdown: function()
  {
    this.menu.destroy();
    this.backButton.destroy();
  }
};

module.exports = BactoMenu;

},{}],17:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    // Tooth Check logo
    this.load.image('logo', 'assets/'+Game.screen+'/toothCheckLogo.png');

  },
 
  create: function() {
    // disable the back button
    //CocoonJS.App.setAppShouldFinishCallback(function() {return false;});

  	this.game.input.maxPointers = 1;
  	this.stage.disableVisibilityChange = true;
    this.scaleStage();
    if (window.orientation === 0) {
      Game.orientation = 'portrait';
      Game.skewX = 1.6;
      Game.skewY = 0.6;
    }
    else {
      Game.orientation = 'landscape';
      Game.skewX = 1;
      Game.skewY = 1;
    }
    this.game.state.start('preload');
  },
  pause: function() {

  },

  scaleStage: function() {
    if (this.game.device.desktop)
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
    }
    else
    {
        this.scale.scaleMode = Phaser.ScaleManager.NO_BORDER;
        this.scale.hasResized.add(this.gameResized, this);
        this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
    }  
    
    this.scale.minWidth = Game.gameWidth/2;
    this.scale.minHeight = Game.gameHeight/2;
    this.scale.maxWidth = Game.gameWidth;
    this.scale.maxHeight = Game.gameHeight;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
        
		if (this.scale.scaleMode==Phaser.ScaleManager.NO_BORDER){
			Game.viewX = (this.scale.width/2 - window.innerWidth/2)*this.scale.scaleFactor.x;
			Game.viewY = (this.scale.height/2 - window.innerHeight/2)*this.scale.scaleFactor.y;
			Game.viewWidth = Game.gameWidth-Game.viewX;
			Game.viewHeight = Game.gameHeight-Game.viewY;
		}
    else
    {
			Game.viewX = 0;
			Game.viewY = 0;
			Game.viewWidth = Game.gameWidth;
			Game.viewHeight = Game.gameHeight;
		}
	   
		document.getElementById("canvas1").style.width = window.innerWidth+"px";
		document.getElementById("canvas1").style.height = window.innerHeight+"px"; //The css for body includes 1px top margin, I believe this is the cause for this -1
		document.getElementById("canvas1").style.overflow = "hidden";

    },

    gameResized: function() {
      Game.viewX = (this.scale.width/2 - window.innerWidth/2)*this.scale.scaleFactor.x;
      Game.viewY = (this.scale.height/2 - window.innerHeight/2 - 1)*this.scale.scaleFactor.y;
      Game.viewWidth = Game.gameWidth-Game.viewX;
      Game.viewHeight = Game.gameHeight-Game.viewY;
    },

    enterIncorrectOrientation: function(){
      this.gameResized();
      // in the following states the game will restart the given state upon orientation change
      if (this.game.state.current === 'accountEvaluation' 
        || this.game.state.current === 'accountTreatment'
        || this.game.state.current === 'menu'
        || this.game.state.current === 'tracker') {
        this.game.state.start(this.game.state.current);
      }
      if (window.orientation === 0) {
        Game.orientation = 'portrait';
        Game.skewX = 1.6;
        Game.skewY = 0.6;
      }
      else {
        Game.orientation = 'landscape';
        Game.skewX = 1;
        Game.skewY = 1;
      }
    },
    
    leaveIncorrectOrientation: function(){
      this.gameResized();
      // in the following states the game will restart the given state upon orientation change
      if (this.game.state.current === 'accountEvaluation' 
        || this.game.state.current === 'accountTreatment'
        || this.game.state.current === 'menu'
        || this.game.state.current === 'tracker') {
        this.game.state.start(this.game.state.current);
      }
      if (window.orientation === 0) {
        Game.orientation = 'portrait';
        Game.skewX = 1.6;
        Game.skewY = 0.6;
      }
      else {
        Game.orientation = 'landscape';
        Game.skewX = 1;
        Game.skewY = 1;
      }
    }
};

module.exports = Boot;

},{}],18:[function(require,module,exports){

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

},{}],19:[function(require,module,exports){

'use strict';

function MealMenu() {}

MealMenu.prototype = {
  preload: function() {
    
  },
  update: function() {
    if (window.orientation === 0) {
      this.game.paused = true;
      this.rotate.visible = true;
    }
  },
  create: function() {
    this.scale.forceOrientation(true, false);

    var gWidth = this.game.width;
    var gHeight = this.game.height;
    
    this.game.stage.backgroundColor = 0x78C0B1;

    // load instructions image
    this.instructions = this.game.add.sprite(0, 0, 'instructions');
    this.instructions.x = gWidth*0.5;
    this.instructions.y = gHeight - this.instructions.height*0.5;
    this.instructions.anchor.setTo(0.5, 0.5);

    // add play button
    this.button = this.game.add.button(0, 0, 'buttonPack', this.playClick, this);
    this.button.frameName = 'playbutton';
    this.button.y = this.instructions.y - this.button.height*0.8;
    this.button.x = gWidth*0.5;
    this.button.anchor.setTo(0.5, 0.5);

    // add exit button
    this.backButton = this.game.add.button(0, 0, 'buttonPack', this.exitClick, this);
    this.backButton.frameName = 'backbutton'
    this.backButton.y = this.backButton.height;
    this.backButton.x = this.backButton.width;
    this.backButton.anchor.setTo(0.5, 0.5);

    // define image for forced rotation message
    this.rotate = this.game.add.sprite(gWidth*0.5, gHeight*0.5, 'rotateImage');
    this.rotate.anchor.setTo(0.5, 0.5);
    this.rotate.visible = false;
    if (window.orientation === 0) {
      this.rotate.visible = true;
      this.game.paused = true;
    }

  },
  pauseUpdate: function() {
    if (window.orientation !== 0) {
      this.game.paused = false;
      this.rotate.visible = false;
    }
  },
  playClick: function() {
    this.awardPoints();
    this.game.state.start('playMeal');
  },
  awardPoints: function() {
    var points = new r2c.Points();
    points.updatePoints();
  },
  exitClick: function() {
    this.game.state.start('menu');
  }, 
  shutdown: function() {
    this.button.destroy();
    this.backButton.destroy();
    this.instructions.destroy();
  }
};

module.exports = MealMenu;

},{}],20:[function(require,module,exports){

'use strict';

var SlideOutMenu = require('../prefabs/slideOutMenu');

function Menu() {}

Menu.prototype = {
  update: function() {
    
  },
  create: function() {
    this.scale.forceOrientation(true, false);
    
    var gWidth = this.game.width;
    var gHeight = this.game.height;

    this.slideOutVisible = false;

    this.game.stage.backgroundColor = 0x78C0B1;

    this.buttons = this.game.add.group();

    // Add our game buttons, with callbacks
    var button;
    button = this.game.add.sprite(0, 0, 'buttonPack', 'appbar');
    button.width *= Game.skewX;
    button.height *= Game.skewY;
    this.buttons.add(button);

    // add background image
    this.logo = this.game.add.sprite(this.game.width*0.5, 0, 'logo');
    this.logo.width *= Game.skewX;
    this.logo.height *= Game.skewY;
    this.logo.y = this.logo.height*0.6;
    this.logo.anchor.setTo(0.5, 0.5);

    var buttonx = this.game.width *0.5;

    // if logged in, alter UI as needed
    if (Game.loggedIn === true) {
      // add the points ring icon
      button = this.game.add.button(gWidth * 0.75, gHeight * 0.6, 'pointRing', this.trackerClick, this);
      if (Game.orientation === 'portrait') {
        button.y = gHeight * 0.25;
        button.x = gWidth * 0.5;
        button.width *= Game.skewX;
        button.height *= Game.skewY;
      }
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);

      // add text for points
      var length = (localStorage.points.toString().length)*0.5;
      this.pointsText = this.game.add.text(button.x - (length*(button.width*0.15)), button.y - (button.height*0.25), 
       '0', { font: Game.fontSize, fill: '#FFFFFF'});
      this.pointsText.height *= Game.skewY;
      this.pointsText.width *= Game.skewX;
      
      this.pointsText.setText(localStorage.points.toString());

      // add the hamburger button to open slideout menu
      button = this.game.add.button(0, 0, 'buttonPack', this.slideOut, this);
      button.frameName = 'hamburgerbutton';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = button.height;
      button.x = gWidth - button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);
      
      if (Game.orientation === 'landscape') {
        buttonx = this.game.width*0.35;
      }
    }
    else {
      // if not logged in, then put the login button in top corner
      var appBarHeight = button.height;
      button = this.game.add.button(0, 0, 'buttonPack', this.loginClick, this);
      button.frameName = 'login';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = appBarHeight*0.5;
      button.x = gWidth - button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);
    }

    // add the button for bactosurfer
    button = this.game.add.button(buttonx, gHeight*0.4, 'bactoSurfButton', this.bactoSurfClick, this);
    button.width *= Game.skewX;
    button.height *= Game.skewY;
    button.anchor.setTo(0.5,0.5);
    if (Game.orientation === 'portrait') {
      if (Game.loggedIn === false) {
        button.y = gHeight * 0.35;
      }
      else {
        button.y = gHeight * 0.5;
      }
    }
    this.buttons.add(button);

    // add the button for mealtime
    button = this.game.add.button(buttonx, gHeight*0.8, 'mealTimeButton', this.mealTimeClick, this);
    button.width *= Game.skewX;
    button.height *= Game.skewY;
    button.anchor.setTo(0.5,0.5);
    if (Game.orientation === 'portrait') {
      if (Game.loggedIn === false) {
        button.y = gHeight * 0.6;
      }
      else {
        button.y = gHeight * 0.75;
      }
    }
    this.buttons.add(button);

    // Build the slideout menu
    this.menu = new SlideOutMenu(this.game);
    
  },
  loginClick: function() {
    this.game.state.start('accountLogin');
  },
  trackerClick: function() {
    // when player view achievements
    this.game.state.start('tracker');
  },
  bactoSurfClick: function() {
    // when player wants to start bacto surf
    this.game.state.start('bactoMenu');
  },
  mealTimeClick: function() {
    // when player wants to start meal time 
    this.game.state.start('mealMenu');
  },
  slideOut: function() {
    this.menu.slideOut();
  },
  exitClick: function() {
    
  },
  shutdown: function() {
    this.buttons.destroy();
    this.menu.destroy();
  }
};

module.exports = Menu;

},{"../prefabs/slideOutMenu":9}],21:[function(require,module,exports){
  'use strict';
  // Includes
  var HexTile = require('../prefabs/HexTile');

  function Play() {}
  Play.prototype = {
    create: function
  ()
  {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.testHex = new HexTile(this.game, 50, 50);
    this.testHex = new HexTile(this.game, 150, 50);
    this.testHex = new HexTile(this.game, 50, 150);
    this.testHex = new HexTile(this.game, 250, 250);
  },
  render: function()
  {

  },
  spawnHex: function ()
  {

  },
    // Bind keys ahead of time to check flags during update
  setupKeys: function ()
  {
    // Setup key listeners to be checked during update
    this.renderToggleKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.weapon1Key = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.weapon2Key = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.weapon3Key = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  },

  // Update function, render new health value, check for weapon firing, check collision and do callbacks
  update: function()
  {

  },
  // Maybe use this for cleaning up inactive ships in ship groups
  groupCleanUp: function(targetGroup)
  {

  }
 };

  module.exports = Play;

},{"../prefabs/HexTile":2}],22:[function(require,module,exports){
'use strict';

// Includes
var BactoSurfer = require('../prefabs/bactoSurfer');
var TeethGroup = require('../prefabs/teethGroup');
var Germ = require('../prefabs/germ');
var Scoreboard = require('../prefabs/scoreboard');
var PowerUp = require('../prefabs/powerup');
var PowerUpFX = require('../prefabs/powerupFX');

var DEBUG_GERMS_ON = true;
var DEBUG_PLAYER_ON = true;
var DEBUG_COLLISION_ON = true;

function PlayBacto() {}

PlayBacto.prototype = {
  preload: function() {
    this.preloadSprite = this.game.add.sprite(this.game.width*0.5, this.game.height*0.55, 'loadingBar');
    this.preloadSprite.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.preloadSprite);

  },
  create: function() 
  {
    this.scale.forceOrientation(true, false);

    this.game.stage.backgroundColor = 0x78C0B1;
    
    var gWidth = this.game.width;
    var gHeight = this.game.height;

    // Stores SFX and Music
    this.bgMusic = this.game.add.audio('bgMusic', 1, true);
    this.splashSFX = this.game.add.audio('splashSFX');
    this.sparkleSFX = this.game.add.audio('sparkleSFX');

    // Set background music to loop
    this.bgMusic.loop = true;
    this.bgMusic.play();

    // Speed at which germs, surfer, power ups and teeth move;
    Game.speed = gWidth * 0.50;
    
    // Starts the physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Give world initial gravity
    this.game.physics.arcade.gravity.y = this.game.height * 2.5;

    // Add the background sprite
    this.mouthBackground = this.game.add.sprite(0, 0, 'bactoBackgrounds', 'mouth_background');

    // Initialize the player
    this.bactoSurfer = new BactoSurfer(this.game, gWidth * 0.5, gHeight * 0.7, 1);
       
    // Stores all teeth (object pool implementation)
    this.teethGroup = new TeethGroup(this.game);
    // Cache tooth height for germ positioning later
    this.toothHeight = this.teethGroup.getAt(0).height;

    // Stores active and in active germs (object pool implementation)
    this.germGroup = this.game.add.group();

    // Stores active power ups 
    this.powerUpGroup = this.game.add.group();

    // add exit button
    this.button = this.game.add.button(0, 0, 'buttonPack', this.exitClick, this);
    this.button.frameName = 'backbutton'
    this.button.y = this.button.height;
    this.button.x = this.button.width;
    this.button.anchor.setTo(0.5, 0.5);
    
    // Fill groups with 16 shark & octopus bacteria off screen
    this.offScreenBuffer = gWidth * 0.125;
    var counter = 0;
    while (counter < 24) {
      if (counter < 12)
      {
        var sharkGerm = new Germ(this.game, 
                            gWidth + this.offScreenBuffer, 
                            0, 'sharkBacteria', 1);
        this.germGroup.add(sharkGerm);
      }
      else
      {
        var octoGerm = new Germ(this.game, 
                      gWidth + this.offScreenBuffer, 
                      0, 'octoBacteria', 1);
        this.germGroup.add(octoGerm);
      }
    counter++;
    }

    // Controls which germ in the germGroup is spawned
    this.spawnIndex = 0;    
    
    // Mouse/Touch controls
    this.game.input.onDown.add(this.invertGravity, this);

    this.gameOver = false;       // Game over flag
    this.germGenerator = null;   // Timer generator for germs    
    this.score = 0;              // Current player score

    this.powerUpType = "";       // The power up to be generated
    this.mouthWashRate = 0.15;   // Chance of mouth wash spawning
    this.toothpasteRate = 0.10;  // Chance of tooth paste spawning

    this.scoreText = this.game.add.text(gWidth * 0.5, gHeight * 0.25, '', { font: Game.fontSize, fill: '#FFFFFF'});

    if (DEBUG_PLAYER_ON)
    {
      // Activate the character
      this.bactoSurfer.init();
    }

    if (DEBUG_GERMS_ON)
    {      
      // Start the time to spawn germs
      this.germGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.5, this.generateGerm, this);
      this.germGenerator.timer.start();
    }

    // define image for forced rotation message
    this.rotate = this.game.add.sprite(gWidth*0.5, gHeight*0.5, 'rotateImage');
    this.rotate.anchor.setTo(0.5, 0.5);
    this.rotate.visible = false;
    if (window.orientation === 0) {
      this.rotate.visible = true;
      this.game.paused = true;
    }
  },

  //+ Jonas Raoni Soares Silva
  //@ http://jsfromhell.com/array/shuffle [v1.0]
  shuffle: function(o)
  { //v1.0
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  },
  
  exitClick: function() 
  {
    this.game.state.start('menu');
  },
  pauseUpdate: function() {
    if (window.orientation !== 0) {
      this.game.paused = false;
      this.rotate.visible = false;
      this.bgMusic.play();
    }
  },
   /**
   * Runs every frame, checks for collisions and overlaps
   */
  update: function() 
  {   
    if (window.orientation === 0) {
      this.game.paused = true;
      this.rotate.visible = true;
    }

    this.game.physics.arcade.collide(this.bactoSurfer, this.teethGroup, this.cleanToothHandler, null, this);

    if (!this.gameOver)
    {
      // Recenter the score as it grows
      if (this.score >= 10 || this.scoreText >= 100 || this.scoreText >= 1000 || this.scoreText >= 10000)
      {
        this.scoreText.x = (this.game.width * 0.5) - this.scoreText.width * 0.5;
      }

      // Check for collision between player and germs
      if (DEBUG_COLLISION_ON)
      {
        this.game.physics.arcade.overlap(this.bactoSurfer, this.germGroup, this.deathHandler, null, this);
      }

      // Check for collision between player and power ups
      this.game.physics.arcade.overlap(this.bactoSurfer, this.powerUpGroup, this.powerUpHandler, null, this);
    }
  },

  /**
   * Shutdown function is called automatically on Phaser state switching
   */
  shutdown: function()
  {
    // Stop all sounds
    this.bgMusic.stop();
    this.splashSFX.stop();
    this.sparkleSFX.stop();

    // Destroy all events, sprites, groups etc
    this.mouthBackground.destroy();
    this.bactoSurfer.destroy();
    this.teethGroup.destroy();
    this.germGroup.destroy();
    this.powerUpGroup.destroy();
    this.button.destroy();
    this.scoreText.destroy();
    this.germGenerator.timer.destroy();

    // Null all variables for GC
    this.toothHeight = null;
    this.offScreenBuffer = null;
    this.spawnIndex = null;
    this.gameOver = null;
    this.germGenerator = null;
    this.score = null;
    this.powerUpType = null; 
    this.mouthWashRate = null;
    this.toothpasteRate = null;
  },

  /**
   * On click, inverses gravity and reduces player velocity
   */
  invertGravity: function()
  {
    if (!this.gameOver)
    {
      // Invert the gravity on click
      this.game.physics.arcade.gravity.y *= -1;
      // Slow down character during the flip for snappier controls
      this.bactoSurfer.body.velocity.y *= 0.30;
    }
  },

  /**
   * On collision, cleans tooth and updates score
   * @param {Phaser.Sprite} player
   * @param {Phaser.Sprite} tooth
   */
  cleanToothHandler: function(player, tooth)
  {
    if(!this.gameOver)
    {
      // Set flag and play cleaning animation
      if (tooth.isClean === 0)
      {      
        tooth.cleanTooth();
        this.score += tooth.pointValue;
        this.scoreText.setText(this.score.toString());
      }  
    }      
  },

  /**
   * On overlap, activates power up effect
   * @param {Phaser.Sprite} player
   * @param {Phaser.Sprite} element
   */
  powerUpHandler: function(player, element)
  {
    var gHeight = this.game.height;

    if(!this.gameOver)
    {
      switch(element.name)
      {
        case "mouthwash":
          // Loop through alive germs and kill them
          for (var i = 0, length = this.germGroup.length; i < length; i++) 
          {
            var currGerm = this.germGroup.getAt(i);
            if (currGerm.alive)
            {
              // Play power up effect
              var splashFX = new PowerUpFX(this.game, currGerm.x, currGerm.y, 'mouthwashEffect', 1);
              this.game.add.existing(splashFX);
              currGerm.reset(); // Kills sprite in pool, resets body and sprite position to offscreen
            }
          }

          this.splashSFX.play();  // Play SFX
          element.destroy();      // Destroy power up
          break;
        case "toothpaste":
          // Loop through all currently uncleaned teeth and clean them
          for (var j = 0, len = this.teethGroup.length; j < len; j++) 
          {
            var currTooth = this.teethGroup.getAt(j);
            if(currTooth.isClean === 0)
            {
              currTooth.cleanTooth();
              this.score += currTooth.pointValue;
            } 
          }

          this.scoreText.setText(this.score.toString()); // Update score

          // Shine top teeth
          for (var k = 0; k < 5; k++) 
          {
            var toothCleanFX = new PowerUpFX(this.game, 0, 0, 'toothpasteEffect', 1);
            toothCleanFX.x = 0 + (k * toothCleanFX.width);
            toothCleanFX.y = gHeight * 0.05;
            this.game.add.existing(toothCleanFX);
          }

          // Shine bottom teeth
          for (var l = 0; l < 5; l++) 
          {
            var toothCleanFX = new PowerUpFX(this.game, 0, 0, 'toothpasteEffect', 1);
            toothCleanFX.x = 0 + (l * toothCleanFX.width);
            toothCleanFX.y = gHeight * 0.9;
            this.game.add.existing(toothCleanFX);
          }
          this.sparkleSFX.play(); // Play SFX
          element.destroy();      // Destroy power up
          break;
        default:
          break;
      }
    }  
  },

  /**
   * On collision, set all values for Game Over state
   * @param {Phaser.Sprite} player
   * @param {Phaser.Sprite} element
   */
  deathHandler: function(player, element)
  {
    if(!this.gameOver)
    {
        this.gameOver = true;
        this.teethGroup.stop();
        this.germGenerator.timer.stop();
        this.scoreText.setText('');
        this.bactoSurfer.alive = false;
        this.game.physics.arcade.gravity.y = 1200;

        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
        this.bgMusic.pause();
    }
  },

  /**
   * Generate germs with potential powerups
   */
  generateGerm: function()
  {
    // Position in which the germs are generated
    //var position = 1;
    var position = Math.floor((Math.random() * 4) + 1);

    // Random generator for powerups
    var powerUpRoll = Math.random() * 1;

    // Choose the power up that will spawn
    if (powerUpRoll <= this.mouthWashRate)
    {
      this.powerUpType = "mouthwash";
    }
    else if (powerUpRoll > this.mouthWashRate && powerUpRoll <= this.mouthWashRate + this.toothpasteRate)
    {
      this.powerUpType = "toothpaste";
    }
    else
    {
      this.powerUpType = "";
    }

    this.positionGerm(position);
  },

  /**
   * Position germ groups
   */
  positionGerm: function(position)
  {
    var gHeight = this.game.height;

    // Size of the group to be spawned
    var groupSize = 0;
    // Cache the length for later use
    var germGroupLength = this.germGroup.length - 1;

    // Choose the group size according to the position
    switch(position)
    {
      case 1: // Top
      case 2: // Bottom
      case 3: // Center
        groupSize = 4;
        break;
      case 4: // Gap
        groupSize = 8;
        break;
    }

    // Position the germs
    for (var i = 0; i < groupSize; i++)
    { 
      // Grab the current germ
      var currGerm = this.germGroup.getAt(this.spawnIndex);

      // If the current germ is alive
      if (currGerm.alive === false && currGerm !== null)
      {
        // Starting positions for germs (Gap & Center formation have slight alterations, see switch case 3 & 4)
        var genStartingX = currGerm.startingX + (i * currGerm.width);
        var topStartingY = this.toothHeight + (i * currGerm.height * 0.5);
        var bottomStartingY = gHeight - this.toothHeight - currGerm.height - (i * currGerm.height * 0.5);

        // Assign proper position to the current germ
        switch(position)
        {
          case 1: // Top
            currGerm.x = genStartingX;
            currGerm.y = topStartingY;
            
            if (i === groupSize - 1 && this.powerUpType !== "")
            {
              this.generatePowerUp(this.powerUpType, currGerm.x, currGerm.y);
            }
            break;
          case 2: // Bottom
            currGerm.x = genStartingX;
            currGerm.y = bottomStartingY;

            if (i === groupSize - 1 && this.powerUpType !== "")
            {
              this.generatePowerUp(this.powerUpType, currGerm.x, currGerm.y);
            }
            break;
          case 3: // Center
            //currGerm.x = gWidth + this.offScreenBuffer;
            currGerm.y = gHeight * 0.5 - currGerm.height * 2 + i * currGerm.height;

            if (i === groupSize * 0.5 && this.powerUpType !== "")
            {
              this.generatePowerUp(this.powerUpType, currGerm.x, currGerm.y);
            }
            break;
          case 4: // Gap
            // Spawn top germ
            currGerm.x = genStartingX;
            currGerm.y = topStartingY;

            // Bottom germs are spawned after the first half of the germs are spawned on top
            if (i >= Math.floor(groupSize * 0.5))
            {
              // Position the bottom germ
              currGerm.x = genStartingX - currGerm.width * (Math.floor(groupSize * 0.5));
              currGerm.y = bottomStartingY + currGerm.height * 2;
            }

            if (i === groupSize - 1 && this.powerUpType !== "")
            {
              this.generatePowerUp(this.powerUpType, currGerm.x, currGerm.y);
            }
            break;
        }
        // Revive the sprite in the sprite pool
        currGerm.revive();

        // Validation on the spawnIndex to make sure it doesn't go out of bounds
        if (this.spawnIndex >= germGroupLength)
        {
          this.spawnIndex = 0;
        }
        else
        {
          this.spawnIndex++;
        }    
      } 
    }
  },

  /**
   * Generate a power up
   * @param {String} powerUpType
   * @param {Number} x
   * @param {Number} y
   */
  generatePowerUp: function(powerUpType, x, y)
  {
    var powerUp = new PowerUp(this.game, 0, 0, 1, powerUpType);

    // Position the power up
    powerUp.x = x + powerUp.width * 2;
    powerUp.y = y - powerUp.height;

    // Add to the stage
    this.game.add.existing(powerUp);
    this.powerUpGroup.add(powerUp);
  }
};

module.exports = PlayBacto;
},{"../prefabs/bactoSurfer":3,"../prefabs/germ":4,"../prefabs/powerup":5,"../prefabs/powerupFX":6,"../prefabs/scoreboard":7,"../prefabs/teethGroup":11}],23:[function(require,module,exports){
'use strict';

var Scoreboard = require('../prefabs/scoreboard');
var Snack = require('../prefabs/snack');
var SkyLine = require('../prefabs/skyline');

  function PlayMeal() {}
  PlayMeal.prototype = {
    preload: function() {
    
    },
    create: function()
    {
      this.scale.forceOrientation(true, false);
      var gWidth = this.game.width;
      var gHeight = this.game.height;

      // kitchen background and scrolling skyline background
      // offset to a higher y position as needed (due to varied screen ratios)
      this.gameBackground = this.game.add.group();
      this.snacks = this.game.add.group();
      
      var skyLine = new SkyLine(this.game, gWidth / 5.5, gHeight / 1.28, 'dayNightCycle');
      skyLine.anchor.setTo(0.5, 0.5);
      this.gameBackground.add(skyLine);

      var kitchenWindow = this.game.add.sprite(0, 0, 'kitchenBackground');
      kitchenWindow.y = gHeight - kitchenWindow.height;
      this.gameBackground.add(kitchenWindow);

      // add exit button
      var button = this.game.add.button(0, 0, 'buttonPack', this.exitClick, this);
      button.frameName = 'backbutton';
      button.y = button.height;
      button.x = button.width;
      button.anchor.setTo(0.5, 0.5);
      this.gameBackground.add(button);

      /* NOTE - since the toothBar is changed with backGround.getTop it should be
      ** the last element added to the background group.
      ** This is the tooth icon which changes to represent player health */
      var toothBar = this.game.add.sprite(gWidth/1.3, gHeight/12, 'toothBar');
      this.gameBackground.add(toothBar);

      // holds the score value
      this.score = 0;
      this.scoreText = this.game.add.text(gWidth * 0.5 - 10, gHeight * 0.1, '0', { font: Game.fontSize, fill: '#FFFFFF'});

      // Add the chef sprite
      this.chef = this.game.add.sprite(gWidth * 0.5, 0, 'mealTimePack', 'mealTimeMenu');
      this.chef.y = gHeight - this.chef.height;
      this.chef.x = gWidth - this.chef.width;
      
      // item generator holds a timer event to spawn next set of snacks
      this.itemGenerator = null;
      // this flag exists avoid the health check when spawning the first wave of snacks
      this.firstSpawn = true;
      // Determines which frame of 'tooth health' animation to be shown
      this.health = 0;
      // Flag for switching to game over screen, set with health check 
      this.gameOver = false;
      // round values determine if it should show a snack/meal and day/night
      this.round = 0;
      // variable to monitor if player hit something
      this.clickedOne = false;
      // time step between snack spawns
      this.timeStep = 2.3;
      // increases speed of snacks every 3rd round
      // base speed is game.width * 0.008
      this.speedUp = this.game.width*0.0003;
      // define max speed for snacks to move at
      this.topSpeed = this.game.width*0.016;

      var i = 0;
      while (i < 6) {
        var snack = new Snack(this.game, gWidth, gHeight, i);
        this.snacks.add(snack);
        i++;
      }
     
      // define image for forced rotation message
      this.rotate = this.game.add.sprite(gWidth*0.5, gHeight*0.5, 'rotateImage');
      this.rotate.anchor.setTo(0.5, 0.5);
      this.rotate.visible = false;
      if (window.orientation === 0) {
        this.rotate.visible = true;
        this.game.paused = true;
      }

      // add input trigger for first click to start game
      this.game.input.onDown.addOnce(this.startGame, this);
    },
    update: function() {
      if (window.orientation === 0) {
        this.game.paused = true;
        this.rotate.visible = true;
      }
    },
    exitClick: function() {
      this.game.state.start('menu');
    },
    pauseUpdate: function() {
      if (window.orientation !== 0) {
        this.game.paused = false;
        this.rotate.visible = false;
      }
    },
    shutdown: function() {
      this.gameBackground.destroy();
      this.snacks.destroy();
    },
    // death handler will be called when hp runs out
    deathHandler: function() {
      this.itemGenerator.timer.removeAll();
      this.gameOver = true;            
      this.scoreboard = new Scoreboard(this.game);
      this.game.add.existing(this.scoreboard);
      this.scoreboard.show(this.score);
    },
    // start game called to init item generation and reset values
    startGame: function() {
      this.chef.destroy();
      this.gameOver = false;
      this.firstSpawn = true;
      this.health = 0;
      this.generate();
      this.itemGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * this.timeStep, this.generate, this);
      this.itemGenerator.timer.start();
    },
    // check score function will iterate through each snack and look at 
    // whether or not it was clicked, update score afterwards
    checkScore: function() {
      // iterate through all snacks in group,
      // check if they scored points and reposition
      this.clickedOne = false;
      
      this.snacks.forEach(this.checkEach, this);

      if (this.clickedOne === false) {
        this.health++;
        var temp = this.gameBackground.getTop();
        temp.frame = this.health;
      }
      
      this.snacks.x = 0;
      // when hp hits max, call death for game over
      if (this.health > 5) {
        this.deathHandler();
      }
      // update score visuals
      this.scoreText.setText(this.score.toString());
      // reset flag for player losing health
      this.hurtThisRound = false;
    },
    // check each looks at the individual snack, whether it was clicked, 
    // and updates score/health based on the type of snack
    checkEach: function(snack) {
      // if this was clicked
      if (snack.clicked == true) {
        this.clickedOne = true;
        var temp;
        /* Key Moment
        * This check determines if the food is a good or bad choice
        * It is currently based on the layout of the snacks spritesheet, with the
        * first half of the spritesheet being the good foods
        */
        if (snack.snackType < 8) {
          this.score++;
        }
        // otherwise it is not healthy
        else {
          // increment health (moving towards death)
          this.health++;
          var temp = this.gameBackground.getTop();
          temp.frame = this.health;
        }
      }
    },

    /*
    * Generation of snacks inside this function is hard coded based on the 
    * sprite sheets number of frames.
    */
    generate: function() {
      // increment current round
      this.round++;
      // decrease time between next wave
      if (this.timeStep > 1.8) {
        this.timeStep -= 0.04;
      }
      var gWidth = this.game.width;
      var gHeight = this.game.height;
      var xInc = gWidth/6;
      var yInc = gHeight*0.125;
      var goodExists = false;
      var waveType = this.game.rnd.integerInRange(0, 2);

      // loop counter
      var i = 0;
      
      // if this is the first spawn, don't bother checking score before hand
      if (this.firstSpawn == false) {
        this.checkScore();
      }
      // otherwise, check score before spawning the next wave
      else {
        this.firstSpawn = false;
      }
      // update tooth health bar based on player health
      // if game is not over, spawn the next wave

      if (!this.gameOver) {
      /* First check round and consider if snack or meal is to be spawned
      * for the moment this will be one meal round per 2 snack rounds
      */
        // if we are on 3rd round, and not past round the maximum number of speed
        // increases which is 
        if (this.round%3 === 0) {
          i = 0;
          while(i<6) {
            var snk = this.snacks.getAt(i);
            // if snacks already at top speed, break loop
            if (snk.xSpeed >= this.topSpeed) {
              break;
            }
            snk.xSpeed += this.speedUp;
            console.log(this.round);
            console.log(snk.xSpeed);
            i++;
          }
        }
        if (waveType === 0) {
          // spawn snacks by row - top row first
          i = 0;
          while (i < 3) {
            // bottom snack
            var temp = this.snacks.getAt(i);
            temp.snackType = this.game.rnd.integerInRange(0, 15);
            if (temp.snackType < 8) {
              goodExists = true;
            }
            temp.frame = temp.snackType;
            temp.x = gWidth + (xInc * i);
            temp.y = gHeight/1.3;
            temp.resetSnack();
            // top snack
            temp = this.snacks.getAt(i+3);
            temp.snackType = this.game.rnd.integerInRange(0, 15);
            if (temp.snackType < 8) {
              goodExists = true;
            }
            temp.frame = temp.snackType;
            temp.x = gWidth + (xInc * i);
            temp.y = gHeight/1.8;
            temp.resetSnack();
            i++;
          }
        }
        // if not a meal round, spawn some snacks
        else if (waveType === 1) {
          i = 0;
          while (i < 3) {
            var temp = this.snacks.getAt(i);
            temp.snackType = this.game.rnd.integerInRange(0, 15);
            if (temp.snackType < 8) {
              goodExists = true;
            }
            temp.frame = temp.snackType;
            temp.resetSnack();
            temp.x = gWidth + (xInc * i);
            temp.y = gHeight/1.3 - (yInc * i);
            // hidden snacks
            temp = this.snacks.getAt(i+3);
            temp.clicked = false;
            temp.visible = false;
            i++;
          }
        }
        else {
          i = 0;
          while (i < 3) {
            var temp = this.snacks.getAt(i);
            temp.snackType = this.game.rnd.integerInRange(0, 15);
            if (temp.snackType < 8) {
              goodExists = true;
            }
            temp.frame = temp.snackType;
            temp.resetSnack();
            temp.x = gWidth + (xInc * i);
            temp.y = gHeight/1.5;
            // hidden snacks
            temp = this.snacks.getAt(i+3);
            temp.clicked = false;
            temp.visible = false;
            i++;
          }
        }
        if (goodExists === false) {
          var temp = this.snacks.getAt(2);
          temp.snackType = this.game.rnd.integerInRange(0,7);
          temp.frame = temp.snackType;
        }
      }
    }
  };
module.exports = PlayMeal;

},{"../prefabs/scoreboard":7,"../prefabs/skyline":8,"../prefabs/snack":10}],24:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    // add a preload visual
    this.preloadSprite = this.game.add.sprite(this.game.width*0.5, this.game.height*0.5, 'logo');
    this.preloadSprite.width *= Game.skewX;
    this.preloadSprite.height *= Game.skewY;
    this.preloadSprite.anchor.setTo(0.5, 0.5);
    //this.load.setPreloadSprite(this.preloadSprite);
    /* Based on scaling code in index and boot, the proper method for
    * image file names is /screenSize/filename.png
    * The following resolutions determine the paired screenSize name
    * 720 width = 'large'
    * 960 width = 'xlarge'
    * 1440 width = 'xxlarge'
    * the URL for all assets should be loaded as (and setup in folder heirarchy) 
    * according to the following line of code
    * this.load.type('assignedName', 'assets/'+Game.screen+'/file.extension');
    */

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    
    // Audio
    if (this.game.device.desktop || this.game.device.iOS || this.game.device.iPhone
     || this.game.device.iPad || this.game.device.iPhone4) {
      this.game.load.audio('bgMusic'    , 'assets/audio/DST-Blam.mp3');
      this.game.load.audio('splashSFX'  , 'assets/audio/Kayyy-Wave.mp3');
      this.game.load.audio('sparkleSFX' , 'assets/audio/Sparkle-Robinhood76.mp3');
      console.log('desk/iOS');
    }
    else {
      console.log('android');
      this.game.load.audio('bgMusic'    , 'assets/audio/DST-Blam.ogg');
      this.game.load.audio('splashSFX'  , 'assets/audio/Kayyy-Wave.ogg');
      this.game.load.audio('sparkleSFX' , 'assets/audio/Sparkle-Robinhood76.ogg');
    }

    // Account screen placeholders
    this.load.image('evaluationScreen', 'assets/'+Game.screen+'/evaluation.png');
    this.load.image('treatmentScreen', 'assets/'+Game.screen+'/treatment.png');

    // Rotate Image
    this.load.image('rotateImage', 'assets/'+Game.screen+'/rotate-image.png');
    
    // Buttons
    this.load.atlasJSONArray('buttonPack', 'assets/'+Game.screen+'/buttons/buttonPack.png',
        'assets/'+Game.screen+'/buttons/buttonPack.json');    
    this.load.image('pointRing', 'assets/'+Game.screen+'/pointRing.png');

    // Slide Out Menu
    this.load.atlasJSONArray('slideoutMenuPack', 'assets/'+Game.screen+'/slideoutmenu/slideoutMenuPack.png',
        'assets/'+Game.screen+'/slideoutmenu/slideoutMenuPack.json');

    // Scoreboard 
    this.load.image('scoreboard', 'assets/'+Game.screen+'/scoreboard.png');
    this.loadDynamicSpriteSheet('medals.png', 'medal', 344, 86, 4);

    // Bacto Surfer Assets START
    this.load.atlasJSONArray('bactoSurferPack', 'assets/'+Game.screen+'/BactoSurfer/bactoSurferPack.png',
        'assets/'+Game.screen+'/BactoSurfer/bactoSurferPack.json');
    this.load.atlasJSONArray('bactoBackgrounds', 'assets/'+Game.screen+'/BactoSurfer/bactoBackgrounds.png',
        'assets/'+Game.screen+'/BactoSurfer/bactoBackgrounds.json');
    this.loadDynamicSpriteSheet('BactoSurfer/tooth.png'           , 'tooth'           ,  864, 121, 6);
    this.loadDynamicSpriteSheet('BactoSurfer/sharkBacteria.png'   , 'sharkBacteria'   ,  549,  71, 9);
    this.loadDynamicSpriteSheet('BactoSurfer/octoBacteria.png'    , 'octoBacteria'    ,  549,  71, 9);
    this.loadDynamicSpriteSheet('BactoSurfer/mouthwashEffect.png' , 'mouthwashEffect' , 1155,  71, 11);
    this.loadDynamicSpriteSheet('BactoSurfer/toothpasteEffect.png', 'toothpasteEffect', 2048, 50, 7);

    // Meal Time Assets
    this.load.atlasJSONArray('mealTimePack', 'assets/'+Game.screen+'/Meal Time/mealTimePack.png',
        'assets/'+Game.screen+'/Meal Time/mealTimePack.json');
    this.load.image('instructions', 'assets/'+Game.screen+'/Meal Time/meal_instructions.png'); 
    this.load.image('kitchenBackground', 'assets/'+Game.screen+'/Meal Time/kitchenBackground.png')
    this.loadDynamicSpriteSheet('Meal Time/text-feedback.png', 'textFeedback', 800,  113, 2);
    this.loadDynamicSpriteSheet('Meal Time/teeth.png'        , 'toothBar'    , 1200, 200, 6);
    this.loadDynamicSpriteSheet('Meal Time/food-icons.png'   , 'food'        , 2048, 121, 16);

    // Achievements
    this.loadDynamicSpriteSheet('achievements/bronzeBaby.png', 'bronzeBaby', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/silverBaby.png', 'silverBaby', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/goldBaby.png', 'goldBaby', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/bronzeGirl.png', 'bronzeGirl', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/silverGirl.png', 'silverGirl', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/goldGirl.png', 'goldGirl', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/bronzeHero.png', 'bronzeHero', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/silverHero.png', 'silverHero', 390, 275, 2);
    this.loadDynamicSpriteSheet('achievements/goldHero.png', 'goldHero', 390, 275, 2);

    // Game buttons
    this.loadDynamicSpriteSheet('buttons/mealtime-button.png' , 'mealTimeButton' , 1128, 216, 2);
    this.loadDynamicSpriteSheet('buttons/bactosurf-button.png', 'bactoSurfButton', 1128, 216, 2);
  },
  create: function() {
    this.scale.forceOrientation(true, false);
    
    //this.preloadSprite.cropEnabled = false;

    if (window.orientation === 0) {
      Game.orientation = 'portrait';
      Game.skewX = 1.6;
      Game.skewY = 0.6;
    }
    // add initial values to game cache if they do not exist
    if (!localStorage.email) {
      console.log('setting default storage values');
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      localStorage.setItem("loggedIn", "false");
    }
    
    else if (localStorage.loggedIn === "true") {
      Game.loggedIn = true;
      Game.passWord = localStorage.password;
      Game.userName = localStorage.email;
      // create new instance of login
      var login = new r2c.Login();
      // call login
      login.doLogin();
    }

  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  },
  pause: function() {
    
  },
  /* @Brief Load a sprite sheet sized to match the current 
  * screen resolution
  * @Parem fileName - The fileName to be loaded
  * @Parem key - The identifier key to access this spritesheet later
  * @Parem baseWidth - The width of the xxlarge sprite sheet
  * @Parem baseHeight - The height of the xxlarge sprite sheet
  * @Parem frames - The number of frames the sheet should be cut into
  */
  loadDynamicSpriteSheet: function(fileName, key, baseWidth, baseHeight, frames) {
    if (Game.screen === 'xlarge') {
      Math.floor(baseWidth /= 1.5);
      Math.floor(baseHeight /= 1.5);
    }
    else if (Game.screen === 'large') {
      Math.floor(baseWidth /= 2);
      Math.floor(baseHeight /= 2);
    }
    else if (Game.screen === 'normal') {
      Math.floor(baseWidth /= 3);
      Math.floor(baseHeight /= 3);
    }

    baseWidth = Math.floor(baseWidth / frames);

    this.load.spritesheet(key, 'assets/'+Game.screen+'/'+fileName, baseWidth, baseHeight, frames);
  }
};

module.exports = Preload;

},{}],25:[function(require,module,exports){
'use strict';

var SlideOutMenu = require('../prefabs/slideOutMenu');

  function Tracker() {}
  Tracker.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
      this.scale.forceOrientation(true, false);

      this.game.stage.backgroundColor = 0x78C0B1;
      
      var gWidth = this.game.width;
      var gHeight = this.game.height;
      
      this.achievements = this.game.add.group();
      this.buttons = this.game.add.group();

      var button = this.game.add.sprite(0, 0, 'buttonPack', 'appbar');
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      this.buttons.add(button);

      // add background image
      this.logo = this.game.add.sprite(this.game.width*0.5, 0, 'logo');
      this.logo.width *= Game.skewX;
      this.logo.height *= Game.skewY;
      this.logo.y = this.logo.height*0.6;
      this.logo.anchor.setTo(0.5, 0.5);
      
      button = this.game.add.button(0, 0, 'buttonPack', this.slideOut, this);
      button.frameName = 'hamburgerbutton';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = button.height;
      button.x = gWidth - button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);

      button = this.game.add.button(0, 0, 'buttonPack', this.exitClick, this);
      button.frameName = 'backbutton';
      button.width *= Game.skewX;
      button.height *= Game.skewY;
      button.y = button.height;
      button.x = button.width;
      button.anchor.setTo(0.5, 0.5);
      this.buttons.add(button);

      this.mobilePositions();
      this.menu = new SlideOutMenu(this.game);
     
      // this value needs to be pulled from the current account
      if (Game.loggedIn === true) {
        this.checkAwardLevel(localStorage.points);
      }
   
    },
    update: function() {
      
    }, 
    exitClick: function() {
      this.game.state.start('menu');
    },
    slideOut: function() {
      this.menu.slideOut();
    },
    mobilePositions: function() {
      var gWidth = this.game.width;  
      var gHeight = this.game.height;

       // Init bronze baby trophy
      var i = 0;
      var trophyTotal = 9;
      var trophy;
      var currentTrophy = 'Baby';
      var currentRow = 0;
      while (i < trophyTotal) {
        // First check which trophy we are on
        if (i===3) {
          currentRow++;
          currentTrophy = 'Girl';
        }
        else if (i === 6) {
          currentRow++;
          currentTrophy = 'Hero';
        }
        // Then load appropriate metal based on counter
        if (i%3 === 0) {
          trophy = this.game.add.sprite(0, 0, 'bronze'+currentTrophy);
        }
        else if (i%3 === 1) {
          trophy = this.game.add.sprite(0, 0, 'silver'+currentTrophy);
        }
        else if (i%3 === 2) {
          trophy = this.game.add.sprite(0, 0, 'gold'+currentTrophy);
        }
        trophy.width *= Game.skewX;
        trophy.height *= Game.skewY;
        // Finally position trophy and add to achievements group
        var startX = 0;
        // First for a portrait layout
        if (window.orientation === 0) {
          trophy.y = trophy.height*0.75 + (currentRow * trophy.height * 1.1);
          startX = (gWidth*0.5) - (trophy.width*1.55);
          trophy.x = startX + (i%3 * trophy.width*1.1);
        }
        else {
          if (i < 6) { 
            trophy.y = trophy.height*0.75;
            startX = (gWidth*0.5) - (trophy.width*3.25);
            trophy.x = startX + ((i%6) * trophy.width*1.1);
          }
          else { 
            trophy.y = trophy.height*0.75 + (trophy.height * 1.1);
            startX = (gWidth*0.5) - (trophy.width*1.55);
            trophy.x = startX + (((i-6)%3) * trophy.width*1.1);
          }
        }
        trophy.frame = 1;
        this.achievements.add(trophy);
        i++;
      }
    },
    checkAwardLevel: function(points) {
      // insert code to check trophy level
      var awardLevel = 0;
      // start at highest award level and work backwards to find highest award received
      console.log(localStorage.points);
      if (points >= 2000) {
        awardLevel = 9;
      }
      else if (points >= 1500) {
        awardLevel = 8;
      }
      else if (points >= 1000) {
        awardLevel = 7;
      }
      else if (points >= 800) {
        awardLevel = 6;
      }
      else if (points >= 600) {
        awardLevel = 5;
      }
      else if (points >= 400) {
        awardLevel = 4;
      }
      else if (points >= 300) {
        awardLevel = 3;
      }
      else if (points >= 200) {
        awardLevel = 2;
      }
      else if (points >= 100) {
        awardLevel = 1;
      }
      else {
        awardLevel = 0;
      }
      // iterate through all trophies and change sprite as needed
      // to match awards received
      var i = 1;
      while (i <= awardLevel) {
        this.achievements.getAt(i-1).frame = 0;
        i++;
      }
    }
  };
module.exports = Tracker;

},{"../prefabs/slideOutMenu":9}]},{},[1])