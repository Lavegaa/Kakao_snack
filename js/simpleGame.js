let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    init: init,
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);

function init() {
  this.score = 0;
  this.scoreText = "";
  this.gameOver = false;
}

function preload() {
  //load assets
  this.load.image('sky','assets/sky.png');
  this.load.image('ground','assets/platform.png');
  this.load.image('star','assets/star.png');
  this.load.image('bomb','assets/bomb.png');
  this.load.spritesheet('dude','assets/dude.png', { frameWidth:32, frameHeight: 48 });
}

function create() {
  //background image
  this.add.image(0,0,'sky').setOrigin(0,0);

  //platform
  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(400,568,'ground').setScale(2).refreshBody();
  this.platforms.create(600,400,'ground');
  this.platforms.create(50,250,'ground');
  this.platforms.create(750,220,'ground');

  //player add
  this.player = this.physics.add.sprite(100, 450, 'dude');
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  //player animation
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //Collect Object
  let stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
  });

  //Bombs
  let bombs = this.physics.add.group();

  //Collider Object
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(stars, this.platforms);
  this.physics.add.collider(bombs, this.platforms);
  this.physics.add.overlap(this.player, stars, function (player, star) {
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
      let x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      let bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200,200), 20);
      bomb.allowGravity = false;
    }
  }, null, this);
  this.physics.add.collider(this.player, bombs, function(player, bomb) {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play('turn');
    gameOver = true;
  }, null, this);

  //Text Object
  this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

  //Input Events
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  //Check Game Over
  if (this.gameOver) {
    return;
  }

  //Keyboard controls
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
    this.player.anims.play('left', true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
    this.player.anims.play('right', true);
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play('turn');
  }
  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
  }
}
