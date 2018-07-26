let player;
let equip = {
  weapon: {
    ID: undefined,
    PART: "weapon",
    HP: 0,
    ATK: 0,
    DEF: 0
  },
  armor: {
    ID: undefined,
    PART: "armor",
    HP: 0,
    ATK: 0, 
    DEF: 0
  },
  status: {
    ID: undefined,
    PART: "status",
    HP: 0,
    ATK: 0, 
    DEF: 0
  }
};
let level = 1;
let tier = 1;

class IntroScene extends Phaser.Scene {
  constructor(config) {
    super({ key: 'intro' });
  }
  init() {

  }
  preload() {
    this.load.image('title','img/title.png');
    this.load.image('button','img/button.png');
  }
  create() {
    this.add.image(400, 200, 'title').setDisplaySize(600,300);

    let btnStart = this.add.image(300, 400, 'button').setDisplaySize(200,100).setInteractive();
    btnStart.name = 'start';
    this.add.text(240, 385, '°ÔÀÓ½ÃÀÛ', { fontSize: 30, fontStyle: 'bold'});
    let btnHow = this.add.image(500, 400, 'button').setDisplaySize(200,100).setInteractive();
    btnHow.name = 'how';
    this.add.text(440, 385, '°ÔÀÓ¹æ¹ý', { fontSize: 30, fontStyle: 'bold'});

    this.input.on('gameobjectover', function(pointer, button) {
      button.setTint(0xf0f0f0);
    });
    this.input.on('gameobjectout', function(pointer, button) {
      button.clearTint();
    });
    this.input.on('gameobjectdown', function(pointer, button) {
      switch (button.name) {
        case 'start':
          this.scene.start('first');
          break;
        case 'how':
          break;
      }
    }, this);
  }
  update() {

  }
}

class ChooseCharacterScene extends Phaser.Scene {
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
    this.nav1 = this.add.text(16,16,'Choose your character', { fontSize: '32px', fill: '#000' });

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

class ChooseItemScene extends Phaser.Scene {
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
    this.load.image('inventory','img/inventory.png');
    this.load.image('item1','img/item1.png');
    this.load.image('item2','img/item2.png');
    this.load.image('item3','img/item3.png');
    this.load.image('item4','img/item4.png');
    this.load.image('select','img/select.png')
  }
  create() {
    this.nav1 = this.add.text(16,16,'Choose your item', { fontSize: '32px', fill: '#000' });

    //show chosen character & recent status
    this.add.image(150, this.playerY, 'player').setDisplaySize(300,320);
    this.add.image(550, this.playerY, 'status').setDisplaySize(500,320);
    if(level%5==0){
      tier++;
    }
    let playerStatus = {
      HP: this.add.text(330, 80, 'HP: '+player.HP, { fontSize: '20px', fill: '#000' }),
      ATK: this.add.text(330, 100, 'ATK: '+player.ATK, { fontSize: '20px', fill: '#000' }),
      DEF: this.add.text(330, 120, 'DEF: '+player.DEF, { fontSize: '20px', fill: '#000' })
    }

    this.add.image(430, 250, 'inventory').setDisplaySize(220,220);
    this.add.image(670, 250, 'inventory').setDisplaySize(220,220);
    let imgWeapon, imgArmor;
    if (equip.weapon.ID != undefined) {
      imgWeapon = this.add.image(430, 250, 'item'+equip.weapon.ID).setDisplaySize(200,200);
    }
    if (equip.armor.ID != undefined) {
      imgArmor = this.add.image(430, 250, 'item'+equip.weapon.ID).setDisplaySize(200,200);
    }

    //create item selection
    this.platforms = this.physics.add.staticGroup();
    let itemList = []
    for (let i=0; i<4; i++) {
      this.platforms.create(100+200*i, this.platformY,'select').setDisplaySize(200,200);
      let item = this.platforms.create(100+200*i,this.platformY,'item'+(i+1)).setDisplaySize(180,180).setInteractive().setTint(505050);
      item.setName(i+1);
      item.setData('part','weapon');
      itemList.push(item);
    }
    // item's status instance randomly
    for(let i=0; i<4; i++){
      let HP__item=0;
      let ATK__item=0;
      let DEF__item=0;
      let HP__status=0;
      let ATK__status=0;
      let DEF__status=0;
      let part = Math.floor(Math.random()*4)+1;
      let part_what;
      if(level%2==1){
        if(part==1){
          ATK__item = Math.floor(Math.random()*2)+2*tier;
          part_what = "weapon";
        }
        else if(part==2){
          HP__item = Math.floor(Math.random()*3)+9*tier;
          part_what = "armor";
        }
        else if(part==3){
          HP__item = Math.floor(Math.random()*3)+4*tier;
          ATK__item = Math.floor(Math.random()*2)+1*tier;
          part_what = "weapon";
        }
        else{
          DEF__item = Math.floor(Math.random()*2)+2*tier;
          part_what = "armor";
        }

        itemList[i].setData({
          hp : HP__item,
          atk : ATK__item,
          def : DEF__item,
          part : part_what
        });
  
        let item = this.add.text(50+180*i, 350, [
          'HP: ' + HP__item,
          'ATK: ' + ATK__item,
          'DEF: ' + DEF__item,
        ], { fontsize: '40px', fill: '#000' });

        console.log('hp :' +HP__item + ' atk : ' + ATK__item + ' def : '+DEF__item);
      }else{
        part_what = "status";
        if(part==1){
          ATK__status = Math.floor(Math.random()*2)+1*tier;
        }
        else if(part==2){
          HP__status = Math.floor(Math.random()*3)+2*tier;
        }
        else if(part==3){
          HP__status = Math.floor(Math.random()*2)+1*tier;
          ATK__status = Math.floor(Math.random()*1)+1*tier;
        }
        else{
          DEF__status = Math.floor(Math.random()*2)+1*tier;
        }
        console.log('hp :' +HP__status + ' atk : ' + ATK__status + ' def : '+DEF__status);
        itemList[i].setData({
          hp : HP__status,
          atk : ATK__status,
          def : DEF__status,
          part : part_what
        });
  
        let item = this.add.text(50+180*i, 350, [
          'HP: ' + HP__status,
          'ATK: ' + ATK__status,
          'DEF: ' + DEF__status
        ], { fontsize: '40px', fill: '#000' });
      }

    }//set random status end
    this.input.on('gameobjectover', function(pointer, gameObject) {
      //clear item tint
      gameObject.clearTint();

      //call data variable
      let itemPART = gameObject.getData('part');
      let itemHP = gameObject.getData('hp');
      let itemATK = gameObject.getData('atk');
      let itemDEF = gameObject.getData('def');

      //show status change
        if (itemPART=='weapon') {
          playerStatus.HP.setText('HP: ' + (player.HP-equip.weapon.HP+itemHP));
          playerStatus.ATK.setText('ATK: ' + (player.ATK-equip.weapon.ATK+itemATK))
          playerStatus.DEF.setText('DEF: ' + (player.DEF-equip.weapon.DEF+itemDEF))
  
          if (equip.weapon.HP<itemHP) {
            playerStatus.HP.setTintFill(0x00ff00);
          } else if (equip.weapon.HP>itemHP) {
            playerStatus.HP.setTintFill(0xff0000);
          }
          if (equip.weapon.ATK<itemATK) {
            playerStatus.ATK.setTintFill(0x00ff00);
          } else if (equip.weapon.ATK>itemATK) {
            playerStatus.ATK.setTintFill(0xff0000);
          }
          if (equip.weapon.DEF<itemDEF) {
            playerStatus.DEF.setTintFill(0x00ff00);
          } else if (equip.weapon.DEF>itemDEF) {
            playerStatus.DEF.setTintFill(0xff0000);
          }
        } else if (itemPART=='armor') {
          playerStatus.HP.setText('HP: ' + (player.HP-equip.armor.HP+itemHP));
          playerStatus.ATK.setText('ATK: ' + (player.ATK-equip.armor.ATK+itemATK))
          playerStatus.DEF.setText('DEF: ' + (player.DEF-equip.armor.DEF+itemDEF))
  
          if (equip.armor.HP<itemHP) {
            playerStatus.HP.setTintFill(0x00ff00);
          } else if (equip.armor.HP>itemHP) {
            playerStatus.HP.setTintFill(0xff0000);
          }
          if (equip.armor.ATK<itemATK) {
            playerStatus.ATK.setTintFill(0x00ff00);
          } else if (equip.armor.ATK>itemATK) {
            playerStatus.ATK.setTintFill(0xff0000);
          }
          if (equip.armor.DEF<itemDEF) {
            playerStatus.DEF.setTintFill(0x00ff00);
          } else if (equip.armor.DEF>itemDEF) {
            playerStatus.DEF.setTintFill(0xff0000);
          }
        }else if (itemPART == 'status'){
          playerStatus.HP.setText('HP: ' + (player.HP+itemHP));
          playerStatus.ATK.setText('ATK: ' + (player.ATK+itemATK))
          playerStatus.DEF.setText('DEF: ' + (player.DEF+itemDEF))
  
          if (equip.status.HP<itemHP) {
            playerStatus.HP.setTintFill(0x00ff00);
          } else if (equip.status.HP>itemHP) {
            playerStatus.HP.setTintFill(0xff0000);
          }
          if (equip.status.ATK<itemATK) {
            playerStatus.ATK.setTintFill(0x00ff00);
          } else if (equip.status.ATK>itemATK) {
            playerStatus.ATK.setTintFill(0xff0000);
          }
          if (equip.status.DEF<itemDEF) {
            playerStatus.DEF.setTintFill(0x00ff00);
          } else if (equip.status.DEF>itemDEF) {
            playerStatus.DEF.setTintFill(0xff0000);
          }
        }
      
      

    }, this);
    this.input.on('gameobjectout', function(pointer, gameObject) {
      //set tint to show it clearly
      gameObject.setTint(505050);

      //set status original
      playerStatus.HP.setText('HP: '+player.HP).clearTint();
      playerStatus.ATK.setText('ATK: '+player.ATK).clearTint();
      playerStatus.DEF.setText('DEF: '+player.DEF).clearTint();

    }, this);
    this.input.on('gameobjectdown', function(pointer, gameObject) {
      //create item object & push into equip
      let item = {
        ID: gameObject.name,
        PART: gameObject.getData('part'),
        HP: gameObject.getData('hp'),
        ATK: gameObject.getData('atk'),
        DEF: gameObject.getData('def')
      }
      switch (item.PART) {
        case 'weapon':
          player.HP += (item.HP-equip.weapon.HP);
          player.ATK += (item.ATK-equip.weapon.ATK);
          player.DEF += (item.DEF-equip.weapon.DEF);
          equip.weapon = item;
          break;
        case 'armor':
          player.HP += (item.HP-equip.armor.HP);
          player.ATK += (item.ATK-equip.armor.ATK);
          player.DEF += (item.DEF-equip.armor.DEF);
          equip.armor = item;
          break;
        case 'status':
          player.HP += (item.HP);
          player.ATK += (item.ATK);
          player.DEF += (item.DEF);
          break;
      }
      console.log("item: ", item);
      console.log("equip: ", equip);
      //change scene with data(image and status)
      this.scene.start('third');
    }, this);
  }
}

class FightScene extends Phaser.Scene {
  constructor() {
    super({ key: 'third' });
  }
  //get data from pre scene
  init() {
    this.monster = {
      HP : (level*3)+10+(tier*2),
      ATK : (level*1)+4+(tier*1),
      DEF : (level*1)+1+(tier*1)
    }
    this.timer = 0;
    this.turn = 'p';
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
    this.load.image('blank','img/blank.png');
    this.load.image('win', 'img/win.png');
    this.load.image('lose', 'img/lose.png');
    this.load.image('button', 'img/button.png');
  }

  create() {
    //create container
    let container = this.add.container(400, 500);
    //view status
    let status = this.add.image(-200, 0, 'status').setDisplaySize(400,200);
    this.HP = this.add.text(-380, -80, 'HP: '+player.HP, { fontsize: '40px', fill: '#000' });
    let ATK = this.add.text(-380, -40, 'ATK: '+player.ATK, { fontsize: '40px', fill: '#000' });
    let DEF = this.add.text(-380, 0, 'DEF: '+player.DEF, { fontsize: '40px', fill: '#000' });

    //view inventory
    let inventory = this.add.group({
      key: 'inventory',
      repeat: 1,
      setXY: { x: 100, y: 0, stepX: 200 }
    }).getChildren();
    inventory[0].setDisplaySize(200,200);
    inventory[1].setDisplaySize(200,200);

    let imgWeapon, imgArmor;
    if (equip.weapon.ID != undefined) {
      imgWeapon = this.add.image(100,0,'item'+equip.weapon.ID).setDisplaySize(150,150);
    } else {
      imgWeapon = this.add.image(100,0,'blank').setDisplaySize(150,150);
    }
    if (equip.armor.ID != undefined) {
      imgArmor = this.add.image(300,0,'item'+equip.armor.ID).setDisplaySize(150,150);
    } else {
      imgArmor = this.add.image(100,0,'blank').setDisplaySize(150,150);
    }

    container.add(status);
    container.add(this.HP);
    container.add(ATK);
    container.add(DEF);
    container.add(inventory);
    container.add(imgWeapon);
    container.add(imgArmor);

    //monster's status
    this.M__HP = this.add.text(-100, -80, 'M_HP: '+this.monster.HP, { fontsize: '40px', fill: '#000' });
    let M__ATK = this.add.text(-100, -40, 'M_ATK: '+this.monster.ATK, { fontsize: '40px', fill: '#000' });
    let M__DEF = this.add.text(-100, 0, 'M_DEF: '+this.monster.DEF, { fontsize: '40px', fill: '#000' });
    console.log(this.monster);
    container.add(this.M__HP);
    container.add(M__ATK);
    container.add(M__DEF);

    //fight event (per 1 second)
    this.playerHP = player.HP;
    this.monsterHP = this.monster.HP;
    this.fightEvent = this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });

  } //create end

  update() {
    //clearTint timer
    this.timer++;
    if (this.timer%60 == 20) {
      this.HP.clearTint();
      this.M__HP.clearTint();
    }
  }

  onEvent() {
    //fight with turn
    if (this.turn == 'p') {
      this.monsterHP -= player.ATK;
      this.M__HP.setText('M_HP: ' + this.monsterHP).setTintFill(0xff0000);
      if (this.monsterHP<=0) {
        this.scene.start('second');
        this.fightEvent.remove(false);
        level++;
      }
      this.turn = 'm';
    } else {
      this.playerHP -= this.monster.ATK;
      this.HP.setText('HP: ' + this.playerHP).setTintFill(0xff0000);
      if (this.playerHP<=0 && this.monsterHP>0) {
        this.scene.start('first');
        this.fightEvent.remove(false);
        level = 1;
        tier = 1;
      }
      this.turn = 'p';
    }
    console.log('fighting!', this.playerHP, this.monsterHP);

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
  scene: [ IntroScene, ChooseCharacterScene, ChooseItemScene, FightScene ]
};

let game = new Phaser.Game(config);