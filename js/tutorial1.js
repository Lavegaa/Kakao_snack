//create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

//some parameters for our scene (our own variables)
gameScene.init = function() {
  this.playerSpeed = 3;
  this.enemyMaxY = window.innerHeight-50;
  this.enemyMinY = 50;
}

//load asset files for our gameScene
gameScene.preload = function() {
  //load images
  this.load.image('background','img/bg_1.png');
  this.load.image('character2','img/character2.png');
  this.load.image('character3','img/character3.png');
  this.load.image('enemy','img/enemy.png');
};

//executed once, after assets were loaded
gameScene.create = function() {
  //reset camera effects
  this.cameras.main.resetFX();

  //background
  let bg = this.add.sprite(0,0,'background');
  bg.setOrigin(0,0);
  bg.setDisplaySize(window.innerWidth,window.innerHeight);

  //player
  this.player = this.add.sprite(60, this.sys.game.config.height/2, 'character3');
  this.player.setScale(0.2);
  this.isPlayerAlive = true;

  //goal
  this.goal = this.add.sprite(this.sys.game.config.width-60, this.sys.game.config.height/2, 'character2');
  this.goal.setScale(0.1);

  //group of enemies
  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: {
      x: window.innerWidth/4,
      y: window.innerHeight/2 - 90,
      stepX: 100,
      stepY: 30
    }
  });
  Phaser.Actions.ScaleXY(this.enemies.getChildren(),-0.95,-0.95);
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    enemy.speed = 6*(Math.random()-0.5);
  }, this);
};

//executed on every frame (60 times per second)
gameScene.update = function() {
  //only if the player is isPlayerAlive
  if (!this.isPlayerAlive) {
    return;
  }
  //check for active input
  if (this.input.activePointer.isDown) {
    //player walks
    this.player.x += this.playerSpeed;
  }

  //enemy movement
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i=0; i<numEnemies; i++) {
    //move enemy
    enemies[i].y += enemies[i].speed;
    //reverse movement if reached the edges
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }
    //enemy collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }

  //goal collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.goal.getBounds())) {
    this.gameOver();
  }
}

//end the game
gameScene.gameOver = function() {
  //flag to set player dead
  this.isPlayerAlive = false;

  //shake the camera
  this.cameras.main.shake(500);
  //fadeout
  this.time.delayedCall(300, function() {
    this.cameras.main.fade(200);
  }, [], this);
  //restart the Scene
  this.time.delayedCall(500, function() {
    this.scene.restart();
  }, [], this);

}

//our game's configuration
let config = {
  type: Phaser.AUTO, //Phaser will decide how to render our game (WebGL or Canvas)
  width: window.innerWidth,
  height: window.innerHeight,
  scene: gameScene
};

//create the game, and pass it the config
let game = new Phaser.Game(config);
