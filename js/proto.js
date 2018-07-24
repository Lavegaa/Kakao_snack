let player;
let equip = [];

class FirstScene extends Phaser.Scene {
  constructor(config) {
    super({ key: 'first' });
    this.platformY = 400;
  }
  preload() {
    //load images
    this.load.image('char1','img/character1.png');
    this.load.image('char2','img/character2.png');
    this.load.image('char3','img/character3.png');
    this.load.image('char4','img/character4.png');
  }
  create() {
    this.input.manager.enabled = true;
    //create character selection
    this.nav1 = this.add.text(16,16,'Choose your character', { fontsize: '32px', fill: '#000' });

    this.platforms = this.physics.add.staticGroup();
    let charList = []
    for (let i=0; i<4; i++) {
      let char = this.platforms.create(160*(i+1),this.platformY,'char'+(i+1)).setScale(0.5).setInteractive().setTint(505050);
      char.setName(i+1);
      charList.push(char);
    }
    charList[0].setData({
      hp: 20, atk: 5, def: 1
    });
    charList[1].setData({
      hp: 10, atk: 5, def: 3
    });
    charList[2].setData({
      hp: 10, atk: 8, def: 1
    });
    charList[3].setData({
      hp: 12, atk: 6, def: 2
    });

    this.input.on('gameobjectover', function(pointer, gameObject) {
      gameObject.clearTint();
    }, this);
    this.input.on('gameobjectout', function(pointer, gameObject) {
      gameObject.setTint(505050);
    }, this);
    this.input.on('gameobjectdown', function(pointer, gameObject) {
      player = {
        ID: gameObject.name,
        HP: gameObject.getData('hp'),
        ATK: gameObject.getData('atk'),
        DEF: gameObject.getData('def')
      }
      console.log(player);
      //change scene with data(image and status)
      this.scene.start('second');
    }, this);
  }
}

class SecondScene extends Phaser.Scene {
  constructor() {
    super( { key: 'second' } );
  }
  //get data from pre scene
  init(data) {
    this.playerY = 220;
    this.platformY = 500;
  }
  preload() {
    //load images
    this.load.image('player','img/character'+player.ID+'.png');
    this.load.image('status','img/status.png');
    this.load.image('item1','img/item1.png');
    this.load.image('item2','img/item2.png');
    this.load.image('item3','img/item3.png');
    this.load.image('item4','img/item4.png');
    this.load.image('select','img/select.png')
  }
  create() {
    this.nav1 = this.add.text(20,20,'Choose your item', { fontsize: '40px', fill: '#000' });

    //show chosen character & recent status
    this.add.image(150, this.playerY, 'player').setDisplaySize(300,320);
    this.add.image(550, this.playerY, 'status').setDisplaySize(500,320);
    let HP = this.add.text(320, 140, [
      'HP: ' + player.HP,
      'ATK: ' + player.ATK,
      'DEF: ' + player.DEF
    ], { fontsize: '40px', fill: '#000' });

    //create item selection
    this.platforms = this.physics.add.staticGroup();
    let itemList = []
    for (let i=0; i<4; i++) {
      this.platforms.create(100+200*i, this.platformY,'select').setDisplaySize(200,200);
      let item = this.platforms.create(100+200*i,this.platformY,'item'+(i+1)).setDisplaySize(180,180).setInteractive().setTint(505050);
      item.setName(i+1);
      itemList.push(item);
    }
    // item's status instance randomly
    for(let i=0; i<4; i++){
      let pHp_i=0;
      let pAtk_i=0;
      let pDef_i=0;
      let key = Math.floor(Math.random()*4)+1;
      if(key==1){
        pAtk_i = Math.floor(Math.random()*2)+2;
      }
      else if(key==2){
        pHp_i = Math.floor(Math.random()*3)+9;
      }
      else if(key==3){
        pHp_i = Math.floor(Math.random()*3)+4;
        pAtk_i = Math.floor(Math.random()*2)+1;
      }
      else{
        pDef_i = Math.floor(Math.random()*2)+2;
      }
      console.log('hp :' +pHp_i + ' atk : ' + pAtk_i + ' def : '+pDef_i);

      itemList[i].setData({
        hp : pHp_i,
        atk : pAtk_i,
        def : pDef_i
      });

      let item = this.add.text(50+180*i, 350, [
        'HP: ' + pHp_i,
        'ATK: ' + pAtk_i,
        'DEF: ' + pDef_i
      ], { fontsize: '40px', fill: '#000' });
    }

    this.input.on('gameobjectover', function(pointer, gameObject) {
      gameObject.clearTint();
    }, this);
    this.input.on('gameobjectout', function(pointer, gameObject) {
      gameObject.setTint(505050);
    }, this);
    this.input.on('gameobjectdown', function(pointer, gameObject) {
      let item = {
        ID: gameObject.name,
        HP: gameObject.getData('hp'),
        ATK: gameObject.getData('atk'),
        DEF: gameObject.getData('def')
      }
      player.HP += item.HP;
      player.ATK += item.ATK;
      player.DEF += item.DEF;
      equip.push(item);
      console.log(item);
      console.log(equip);
      //change scene with data(image and status)
      this.scene.start('third');
    }, this);
  }
}

class ThirdScene extends Phaser.Scene {
  constructor() {
    super({ key: 'third' });
  }
  //get data from pre scene
  init() {
    let level = 1;
    this.monster = {
      HP : (level*3)+10,
      ATK : (level*1)+4,
      DEF : (level*1)+1
    }
  }
  preload() {
    this.load.image('player','img/character'+player.ID+'.png');
    this.load.image('status', 'img/status.png');
    this.load.image('inventory', 'img/inventory.png');
    this.load.image('item1','img/item1.png');
    this.load.image('item2','img/item2.png');
    this.load.image('item3','img/item3.png');
    this.load.image('item4','img/item4.png');
    this.load.image('fight','img/fight.png');
  }
  create() {
    //create container
    let container = this.add.container(400, 500);
    //view status
    let status = this.add.image(-200, 0, 'status').setDisplaySize(400,200);
    let HP = this.add.text(-380, -80, 'HP: '+player.HP, { fontsize: '40px', fill: '#000' });
    let ATK = this.add.text(-380, -40, 'ATK: '+player.ATK, { fontsize: '40px', fill: '#000' });
    let DEF = this.add.text(-380, 0, 'DEF: '+player.DEF, { fontsize: '40px', fill: '#000' });

    //view inventory
    let inventory = this.add.group({
      key: 'inventory',
      repeat: 1,
      setXY: { x: 100, y: 0, stepX: 200 },
      setSize: { x: 200, y: 200 }
    }).getChildren();
    inventory[0].setDisplaySize(200,200);
    inventory[1].setDisplaySize(200,200);

    let item1 = this.add.image(100,0,'item'+equip[0].name).setDisplaySize(150,150);
    let item2 = this.add.image(300,0,'item2').setDisplaySize(150,150);

    container.add(status);
    container.add(HP);
    container.add(ATK);
    container.add(DEF);
    container.add(inventory);
    container.add(item1);
    container.add(item2);

    //monster's status
    let M__HP = this.add.text(-100, -80, 'M_HP: '+this.monster.HP, { fontsize: '40px', fill: '#000' });
    let M__ATK = this.add.text(-100, -40, 'M_ATK: '+this.monster.ATK, { fontsize: '40px', fill: '#000' });
    let M__DEF = this.add.text(-100, 0, 'M_DEF: '+this.monster.DEF, { fontsize: '40px', fill: '#000' });
    console.log(this.monster);
    container.add(M__HP);
    container.add(M__ATK);
    container.add(M__DEF);
    let fight = this.add.image(400,200,'fight').setDisplaySize(100,100).setInteractive();

    let playerHP = player.HP;
    let monsterHP = this.monster.HP;
    fight.on('pointerdown', function(pointer) {
      console.log('hi');
      monsterHP -= player.ATK;
      M__HP.setText('M_HP: '+monsterHP);
      if(monsterHP<=0) {
        this.scene.start('second',{ char: player.ID, status : player});
      }

      playerHP -= this.monster.ATK;
      HP.setText('HP: ' + playerHP);
      if(playerHP<=0) { this.scene.start('first'); }

    }, this);



  } //create end




  update() {

  }
}
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#fff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [ FirstScene, SecondScene, ThirdScene ]
};

let game = new Phaser.Game(config);
