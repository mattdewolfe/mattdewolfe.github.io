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
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var Character = function(game, x, y, image) {
  Phaser.Sprite.call(this, game, x, y, image);

  this.game.add.existing(this);

  // Visual parameters
  this.anchor.setTo(0.5);
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Updates the sprite every frame
 */
Character.prototype.update = function()
{

};

Character.prototype.changeVisual = function(newSprite)
{
  this.loadTexture(newSprite);
};

module.exports = Character;

},{}],3:[function(require,module,exports){
'use strict';

// need to add in steering requisite
var TumblerRing = function(game, x, y, image, rotation, isActive, skillLevel) {
  Phaser.Sprite.call(this, game, x, y, image);

  this.game.add.existing(this);

  // Class parameters
  // Rotation speed of tumbler when active
  this.rotationSpeed = rotation;
  this.setSpeed = 12 - skillLevel;
  // Active flag denotes a tumbler is not locked in yet
  this.isActiveTumbler = isActive;


  // Visual parameters
  this.anchor.setTo(0.5);
};

TumblerRing.prototype = Object.create(Phaser.Sprite.prototype);
TumblerRing.prototype.constructor = TumblerRing;

/**
 * Updates the sprite every frame
 */
TumblerRing.prototype.update = function()
{

};

TumblerRing.prototype.rotateTumblerLeft = function()
{
  if (this.isActiveTumbler === false)
  {
    this.angle -= this.setSpeed;
  }
  else
  {
    this.angle += this.rotationSpeed;
  }
};
TumblerRing.prototype.rotateTumblerRight = function()
{
  if (this.isActiveTumbler === false)
  {
    this.angle += this.setSpeed;
  }
  else
  {
    this.angle += this.rotationSpeed;
  }
};

TumblerRing.prototype.toggleRender = function()
{
  this.visibibility = !this.visibility;
};
/**
 * Render the waypoint to screen
 */
TumblerRing.prototype.render = function()
{
  this.game.debug.spriteInfo(this, 32, 32);
};

module.exports = TumblerRing;

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){

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

},{}],6:[function(require,module,exports){
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '30px spaceagefont', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.width/2 - 130, this.game.height/3, 'PlayerFront');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.bitmapText(this.game.width/2 - 80, this.game.height/3,
      'spaceagefont', 'Hyper-Prison!', 24);

    this.instructionText = this.game.add.bitmapText(this.game.width/2 - 175, this.game.height/2.25,
      'spaceagefont', 'Click anywhere to begin', 20);

    this.instructionsText1 = this.game.add.bitmapText(30, this.game.height/1.75,
      'spaceagefont', 'Rotate the active tumbler with the left/right arrows', 18);

    this.instructionsText2 = this.game.add.bitmapText(50, this.game.height/1.5,
      'spaceagefont', 'Click the Fist icon when two tumblers are lined up', 18);


    this.creditText = this.game.add.bitmapText(25, this.game.height - 25,
      'spaceagefont', 'by Matt De Wolfe', 20);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){
  'use strict';
  // Includes
  var TumblerRing = require('../prefabs/TumblerRing');
  var Character = require('../prefabs/Character');
  function Play() {}
  Play.prototype = {
    create: function()
  {
    // Simple scaling difficulty value that increases each time a level is cleared
    this.difficulty = 0;
    // Current level player is on
    this.currentLevel = 0;
    // Amount of time to play the game
    this.timeToPlay = 30.0;
    // Simple flag for calling game over function once, and only once
    this.isGameOver = false;
    // Starting skill level for the player
    this.playerSkill = 3;
    // Skill cap
    this.maxSkillLevel = 10;
    // Simple flag for playing click sound only once per alignment
    this.areCurrentTumblersAligned = false;

    // Number of degrees two tumblers must be within of each other in order to set
    this.tumblerPrecision = 6;
    // Create a timer to track play time
    this.completionTimer = this.game.time.create(false);
    this.completionTimer.loop(10, this.timerTicks, this);
    this.completionTimer.start();
    this.completionTimer.pause();

    // Setup audio elements
    this.levelClearedSFX = this.game.add.audio('LevelClearedSFX');
    this.tumblerSetSFX = this.game.add.audio('TumblerSetSFX');
    this.tumblerClickSFX = this.game.add.audio('TumblerClickSFX');


    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Initialize group of tumblers
    this.tumbler1;
    this.tumbler2;
    this.tumbler3;
    this.tumbler4;
    this.tumblerGroup = this.game.add.group();

    // Setup sprites for our player and his friend (inside the prison)
    this.playerSprite = new Character(this.game, 60, 460, 'PlayerSad');
    this.friendSprite = new Character(this.game, this.game.width/2, this.game.height/2, 'FriendoSad');

    // Setup button to dispaly on level clear
    this.levelClearedSprite = this.game.add.sprite(this.game.width/2, this.game.height/1.2, 'LevelCleared');
    this.levelClearedSprite.anchor.set(0.5);
    this.levelClearedSprite.inputEnabled = true;
    this.levelClearedSprite.events.onInputDown.add(this.nextLevel, this);

    // Setup the tumbler icon, hide it, and add input to it
    this.setTumblerIcon = this.game.add.sprite(this.game.width - 150, this.game.height/2, 'SetTumbler');
    this.setTumblerIcon.anchor.set(0.5);
    this.setTumblerIcon.inputEnabled = true;
    this.setTumblerIcon.events.onInputDown.add(this.tumblerSet, this);

    this.instructionsText1 = this.game.add.bitmapText(5, 30,
      'spaceagefont', 'Higher player skill will make for more precise movements', 18);

    this.instructionsText2 = this.game.add.bitmapText(160, 60,
      'spaceagefont', 'Start from the inside and work out', 18);
    this.hudText = this.game.add.text(30,
      550,
      "Level:", {
      font: "26px Arial",
      fill: "#ff0044",
      align: "center" });
    this.skillText = this.game.add.text(30,
      520,
      "Skill:", {
        font: "26px Arial",
        fill: "#ff0044",
        align: "center" });
    this.timerText = this.game.add.text(this.game.width - 280,
      550,
      "Time Remaining: ", {
        font: "26px Arial",
        fill: "#ff0044",
        align: "center" });


    // Setup listener functions
    this.rotateLeftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rotateRightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.skillUpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);

    this.tumblersSet = 1;
    this.nextLevel();
  },
  // Called by the timer every 10 milliseconds
  timerTicks: function()
  {
    this.timeToPlay -= 0.01;
  },

  // Load up the next level
  nextLevel: function()
  {
    this.tumblersSet = 1;
    // Increment level counter
    this.currentLevel += 1;
    // Ramp up the difficulty faster after level 4
    if (this.currentLevel > 4)
    {
      this.difficulty += this.currentLevel/2;
    }
    else
    {
      this.difficulty += 1;
    }
    // Generate a new level
    this.tumblerGroup.removeAll(true);
    this.generateLevel();
  },
    // Called when the tumbler icon is clicked
  tumblerSet: function()
  {
    this.checkAlignment();
  },

  render: function()
  {

  },
  // Rotate the active tumbler left
  rotateTumblerLeft: function()
  {
    this.tumblerGroup.callAll('rotateTumblerLeft');
  },
  // Rotate the active tumbler right
  rotateTumblerRight: function()
  {
    this.tumblerGroup.callAll('rotateTumblerRight');
  },
  // Update function, render new health value, check for weapon firing, check collision and do callbacks
  update: function()
  {
    // If the timer is below 0 and the gameover flag is not set yet
    if (this.timeToPlay <= 0 && this.isGameOver === false)
    {
      this.gameOver();
    }
    // Otherwise, if the game is over we wait for input
    else if (this.isGameOver === true)
    {
      if (this.game.input.activePointer.isDown)
      {
        this.game.state.start('menu');
      }
    }
    // Otherwise do ordinary update loop logic
    else
    {
      // First check for key presses to rotate active tumbler
      if (this.rotateLeftKey.isDown)
      {
        this.rotateTumblerLeft();
      }
      if (this.rotateRightKey.isDown)
      {
        this.rotateTumblerRight();
      }
      if (this.skillUpKey.justPressed(100)==true)
      {
        this.increasePlayerSkill();
      }
      // If all 4 tumblers are set, the round is over
      if (this.tumblersSet >= 4)
      {
        this.roundOver();
      }
      this.checkForClickSound();
    }
    // Update timer text
    this.timerText.setText("Time Remaining: " + this.timeToPlay.toFixed(2));
    this.skillText.setText("Skill: " + this.playerSkill);
  },
  // Check for tumbler alignment to play audible queue
  checkForClickSound: function()
  {
    switch (this.tumblersSet)
    {
      case 1:
        if (Math.abs(this.tumbler1.angle - this.tumbler2.angle) < this.tumblerPrecision)
        {
          if (this.areCurrentTumblersAligned == false)
          {
            this.areCurrentTumblersAligned = true;
            this.tumblerClickSFX.play();
          }
        }
        else
        {
          this.areCurrentTumblersAligned = false;
        }
        break;
      case 2:
        if (Math.abs(this.tumbler2.angle - this.tumbler3.angle) < this.tumblerPrecision)
        {
          if (this.areCurrentTumblersAligned == false)
          {
            this.areCurrentTumblersAligned = true;
            this.tumblerClickSFX.play();
          }
        }
        else
        {
          this.areCurrentTumblersAligned = false;
        }
        break;
      case 3:
        if (Math.abs(this.tumbler3.angle - this.tumbler4.angle) < this.tumblerPrecision)
        {
          if (this.areCurrentTumblersAligned == false)
          {
            this.areCurrentTumblersAligned = true;
            this.tumblerClickSFX.play();
          }
        }
        else
        {
          this.areCurrentTumblersAligned = false;
        }
        break;
      default:

        break;
    }
  },
  // Increase the players skill, this will apply to the next level
  increasePlayerSkill: function()
  {
    this.playerSkill += 1;
    // Clamp to max
    if (this.playerSkill > this.maxSkillLevel)
    {
      this.playerSkill = this.maxSkillLevel;
    }
  },

  // Check the alignment off the tumblers
  checkAlignment: function()
  {
    switch (this.tumblersSet)
    {
      case 1:
        if (Math.abs(this.tumbler1.angle - this.tumbler2.angle) < this.tumblerPrecision)
        {
          this.tumblerSetSFX.play();
          this.tumbler2.isActiveTumbler = false;
          this.tumblersSet+=1;
        }
        break;
      case 2:
        if (Math.abs(this.tumbler2.angle - this.tumbler3.angle) < this.tumblerPrecision)
        {
          this.tumblerSetSFX.play();
          this.tumbler3.isActiveTumbler = false;
          this.tumblersSet+=1;
        }
        break;
      case 3:
        if (Math.abs(this.tumbler3.angle - this.tumbler4.angle) < this.tumblerPrecision)
        {
          this.tumblerSetSFX.play();
          this.tumbler4.isActiveTumbler = false;
          this.tumblersSet+=1;
        }
        break;
      default:

        break;
    }
  },

  // Builds a level based on difficulty, and sets visibility to proper states for start of level
  generateLevel: function()
  {
    // Change player sprites
    this.playerSprite.changeVisual('PlayerSad');
    this.friendSprite.changeVisual('FriendoSad');

    this.levelClearedSprite.visible = false;

    this.tumblerGroup.visible = true;

    // Create 4 new tumbler rings, passing in the difficulty with additional parameters to create variety in spin speed
    // as well as setting default angle to a random value between 1 and 360
    this.tumbler1 = new TumblerRing(this.game, this.game.width/2, this.game.height/2, 'RedRingSprite',
      12 - this.playerSkill, false, this.playerSkill);
    this.tumbler1.angle += Math.floor((Math.random() * 360) + 1);
    this.tumblerGroup.add(this.tumbler1);

    this.tumbler2 = new TumblerRing(this.game, this.game.width/2, this.game.height/2, 'BlueRingSprite',
      (this.difficulty+2)*-1, true, this.playerSkill);
    this.tumbler2.angle += Math.floor((Math.random() * 360) + 1);
    this.tumblerGroup.add(this.tumbler2);

    this.tumbler3 = new TumblerRing(this.game, this.game.width/2, this.game.height/2, 'GreenRingSprite',
      (this.difficulty/2), true, this.playerSkill);
    this.tumbler3.angle += Math.floor((Math.random() * 360) + 1);
    this.tumblerGroup.add(this.tumbler3);

    this.tumbler4 = new TumblerRing(this.game, this.game.width/2, this.game.height/2, 'WhiteRingSprite',
      (this.difficulty + 3), true, this.playerSkill);
    this.tumbler4.angle += Math.floor((Math.random() * 360) + 1);
    this.tumblerGroup.add(this.tumbler4);

    this.setTumblerIcon.visible = true;
    this.completionTimer.resume();
    this.hudText.setText("Level: " + this.currentLevel);
  },

  // Called when all 4 tumblers are set, the round is over
  roundOver: function()
  {
    // Change player sprites
    this.levelClearedSFX.play();
    this.tumblersSet = 1;
    this.playerSprite.changeVisual('PlayerHappy');
    this.friendSprite.changeVisual('FriendoHappy');
    // Hide lock sprites
    this.tumblerGroup.visible = false;
    this.levelClearedSprite.visible = true;
    this.completionTimer.pause();
  },
  // Called when the timer runs out, and the game is over
  gameOver: function()
  {
    this.isGameOver = true;

    // Stop timer, clamp displayed time value to 0
    this.completionTimer.pause();
    this.timeToPlay = 0.0;
    // Clear all the sprites we do not want on screen
    this.instructionsText1.visible = false
    this.instructionsText2.visible = false;
    this.tumblerGroup.visible = false;
    this.setTumblerIcon.visible = false;
    this.levelClearedSprite.visible = false;
    this.friendSprite.visible = false;

    this.playerSprite.changeVisual('PlayerHappy');
    // If its the first level, they didn't save anyone
    if (this.currentLevel === 1)
    {
      this.victoryText = this.game.add.text(190,
        80,
        "You didn't save anyone. Not one.", {
          font: "28px Arial",
          fill: "#ff0044",
          align: "center" });
    }
    // Else inform player of how well they did, and draw some friends to the screen
    else
    {
      this.victoryGroup = this.game.add.group();
      var tempFriend;
      for (var i = 0; i < this.currentLevel-1; i++)
      {
        tempFriend = new Character(this.game, 50 + (60*i), this.game.height/2, 'FriendoHappy');
        this.victoryGroup.add(tempFriend);
      }

      this.victoryText = this.game.add.text(250,
        80,
        "You saved " + (this.currentLevel-1) + " friends!", {
          font: "28px Arial",
          fill: "#ff0044",
          align: "center" });
    }
    this.victoryText2 = this.game.add.text(210,
      30,
      "Click anywhere to return to the menu.", {
        font: "22px Arial",
        fill: "#ff0044",
        align: "center" });
  }
 };

  module.exports = Play;

},{"../prefabs/Character":2,"../prefabs/TumblerRing":3}],8:[function(require,module,exports){

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

    // Load up audio
    this.game.load.audio('LevelClearedSFX', 'assets/audio/jingle.ogg');
    this.game.load.audio('TumblerSetSFX'    , 'assets/audio/phaserUp1.ogg');
    this.game.load.audio('TumblerClickSFX'    , 'assets/audio/metalClick.ogg');

    // Load up sprites
    this.load.image('BlueRingSprite', 'assets/blueRing.png');
    this.load.image('GreenRingSprite', 'assets/greenRing.png');
    this.load.image('RedRingSprite', 'assets/redRing.png');
    this.load.image('WhiteRingSprite', 'assets/whiteRing.png');
    this.load.image('SetTumbler', 'assets/set-tumbler.png');
    this.load.image('PlayerSad', 'assets/player-sad.png');
    this.load.image('PlayerHappy', 'assets/player-happy.png');
    this.load.image('PlayerFront', 'assets/player-front.png');
    this.load.image('FriendoSad', 'assets/friendo-sad.png');
    this.load.image('FriendoHappy', 'assets/friendo-happy.png');
    this.load.image('LevelCleared', 'assets/unlocked.png');
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