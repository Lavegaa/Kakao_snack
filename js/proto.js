let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
let titleWidth = gameWidth/5*4;
let titleHeight = titleWidth;
let player = {
  ID: undefined,
  HP: 0,
  ATK: 0,
  init: function() {
    this.ID = undefined;
    this.HP = 0;
    this.ATK = 0;
  }
};
let equip = {
  weapon: {
    ID: undefined,
    PART: "weapon",
    HP: 0,
    ATK: 0
  },
  armor: {
    ID: undefined,
    PART: "armor",
    HP: 0,
    ATK: 0
  },
  status: {
    ID: undefined,
    PART: "status",
    HP: 0,
    ATK: 0
  },
  init: function() {
    this.weapon = {
      ID: undefined,
      PART: "weapon",
      HP: 0,
      ATK: 0
    };
    this.armor = {
      ID: undefined,
      PART: "armor",
      HP: 0,
      ATK: 0
    };
    this.status = {
      ID: undefined,
      PART: "status",
      HP: 0,
      ATK: 0
    };
  }
};
let level = 1;
let tier = 1;
let shp=0;
let satk=0;

let test = 0;

class IntroScene extends Phaser.Scene {
  constructor(config) {
    super({ key: 'intro' });
  }
  preload() {
    this.load.image('bg','img/bg_intro.png');
    this.load.image('title','img/title.png');
    this.load.image('button','img/button.png');
  }
  create() {
    //window.addEventListener('resize', resize);
    //resize();

    //set bg & title
    this.add.image(gameWidth/2, gameHeight/2, 'bg').setDisplaySize(gameWidth, gameHeight);
    this.add.image(gameWidth/2, gameHeight/4, 'title').setDisplaySize(titleWidth,titleHeight);

    //create button
    let btnStart = this.add.image(gameWidth/7*2, gameHeight/6*5, 'button').setDisplaySize(gameWidth/3,gameWidth/6).setInteractive();
    btnStart.name = 'start';
    let txtStart = this.add.text(0, 0, '게임시작', { fontSize: btnStart.displayHeight/3, fontStyle: 'bold'});
    txtStart.x = btnStart.x - txtStart.displayWidth/2;
    txtStart.y = btnStart.y - txtStart.displayHeight/2;
    let btnHow = this.add.image(gameWidth/7*5, gameHeight/6*5, 'button').setDisplaySize(gameWidth/3,gameWidth/6).setInteractive();
    btnHow.name = 'how';
    let txtHow = this.add.text(0, 0, '게임방법', { fontSize: btnStart.displayHeight/3, fontStyle: 'bold'});
    txtHow.x = btnHow.x - txtHow.displayWidth/2;
    txtHow.y = btnHow.y - txtHow.displayHeight/2;

    //input handler(buttons)
    this.input.on('gameobjectdown', function(pointer, button) {
      button.setTint(0xf0f0f0);
    });
    this.input.on('gameobjectup', function(pointer, button) {
      button.clearTint();
      switch (button.name) {
        case 'start':
          this.scene.start('first');
          break;
        case 'how':
          player.init();
          break;
      }
    }, this);
  }
}

class ChooseCharacterScene extends Phaser.Scene {
  constructor(config) {
    super({ key: 'first' });
  }
  preload() {
    //load images
    this.load.image('char1','img/character1.png');
    this.load.image('char2','img/character2.png');
    this.load.image('char3','img/character3.png');
    this.load.image('char4','img/character4.png');
    this.load.image('UI','img/status.png');
    this.load.image('left','img/left.png');
    this.load.image('right','img/right.png');
    this.load.image('button', 'img/button.png');
  }
  create() {
    this.input.manager.enabled = true;
    //create character selection
    this.add.image(gameWidth/2, gameHeight/16, 'UI').setDisplaySize(gameWidth, gameHeight/8);
    this.nav1 = this.add.text(16,16,'Choose your character', { fontSize: '32px', fill: '#000' });

    let now = 0;
    let charList = [
      this.createCharacter(gameWidth/2, gameHeight/16*9, 1, 20, 5),
      this.createCharacter(gameWidth/2, gameHeight/16*9, 2, 10, 5),
      this.createCharacter(gameWidth/2, gameHeight/16*9, 3, 10, 8)
    ];
    charList[1].setVisible(false);
    charList[2].setVisible(false);

    let btnLeft = this.add.image(gameWidth*0.1, gameHeight/16*9, 'left').setDisplaySize(gameWidth*0.2, gameWidth*0.2).setInteractive();
    btnLeft.setName('left');
    let btnRight = this.add.image(gameWidth*0.9, gameHeight/16*9, 'right').setDisplaySize(gameWidth*0.2, gameWidth*0.2).setInteractive();
    btnRight.setName('right');

    this.input.on('gameobjectdown', function(pointer, button) {
      button.setTint(0x505050);
    });
    this.input.on('gameobjectup', function(pointer, button) {
      button.clearTint();
      switch (button.name) {
        case 'left':
          charList[now].setVisible(false);
          if (now == 0) { now = 2; }
          else { now--; }
          charList[now].setVisible(true);
          break;
        case 'right':
          charList[now].setVisible(false);
          if (now == 2) { now = 0; }
          else { now++; }
          charList[now].setVisible(true);
          break;
        default:
          player.ID = button.name;
          player.HP = button.getData('hp');
          player.ATK = button.getData('atk');

          console.log(player);
          //change scene
          this.scene.start('second');
          break;
      }
    }, this);

  }
  createCharacter(x, y, id, hp, atk) {
    let container = this.add.container(x,y).setSize(gameWidth*0.6,gameHeight*0.6).setDepth(id);
    let bg = this.add.image(0, 0, 'UI').setDisplaySize(container.width,container.height);
    let char = this.add.image(0, -container.height*0.2, 'char'+id).setDisplaySize(container.width,container.height*0.6);
    let status = this.add.image(0, container.height*0.2, 'UI').setDisplaySize(container.width*0.8, container.height*0.2);
    let txtStatus = this.add.text(-status.displayWidth/2, status.y-status.displayHeight/2, [
      'HP: ' + hp,
      'ATK: ' + atk
    ], { fontSize: 12, fontStyle: 'bold', padding: 8 });

    let btnSelect = this.add.image(0, container.height*0.38, 'button').setDisplaySize(container.width/3,container.width/6).setInteractive();
    let txtSelect = this.add.text(0, 0, '게임시작', { fontSize: btnSelect.displayHeight/3, fontStyle: 'bold'});
    txtSelect.x = btnSelect.x - txtSelect.displayWidth/2;
    txtSelect.y = btnSelect.y - txtSelect.displayHeight/2;

    btnSelect.setName(id);
    btnSelect.setData({ hp: hp, atk: atk });

    container.add([bg, char, status, txtStatus, btnSelect, txtSelect]);

    return container;
  }
}

class ChooseItemScene extends Phaser.Scene {
  constructor() {
    super( { key: 'second' } );
  }
  preload() {
    //load images
    this.load.image('player','img/character'+player.ID+'.png');
    this.load.image('UI','img/status.png');
    this.load.image('inventory','img/inventory.png');
    this.load.image('item1','img/item1.png');
    this.load.image('item2','img/item2.png');
    this.load.image('item3','img/item3.png');
    this.load.image('item4','img/item4.png');
    this.load.image('select','img/select.png')
    this.load.image('blank','img/blank.png');
  }
  create() {
    if (level%5==0) { tier++; }

    let nav = this.add.container(gameWidth/2,gameHeight*0.05).setSize(gameWidth,gameHeight*0.1);
    let imgNavbg = this.add.image(0, 0, 'UI').setDisplaySize(nav.width, nav.height);
    let txtNav = this.add.text(0, 0,'보상을 고르세요', { fontSize: nav.height*0.3, fill: '#000' }).setPadding({ left: nav.width/20 });
    txtNav.x = -nav.width/2;
    txtNav.y = -txtNav.height/2 - nav.height/6;
    let txtNow = this.add.text(0, 0,'level: '+level+' tier : '+tier, { fontSize: nav.height*0.3, fill: '#000' }).setPadding({ left: nav.width/20 });
    txtNow.x = -nav.width/2;
    txtNow.y = -txtNow.height/2 + nav.height/6;
    nav.add([imgNavbg,txtNav,txtNow]);

    //show chosen character & recent status
    let container = this.add.container(gameWidth/2,gameHeight*0.85).setSize(gameWidth,gameHeight*0.3);
    let imgBg = this.add.image(0,0,'UI').setDisplaySize(container.width, container.height);
    let imgChar = this.add.image(-container.width*0.35, 0,  'player').setDisplaySize(container.height,container.height);
    let imgWeaponBg = this.add.image(-container.width*0.025, -container.height*0.2, 'inventory').setDisplaySize(container.height*0.5, container.height*0.5);
    let imgArmorBg = this.add.image(container.width*0.325, -container.height*0.2, 'inventory').setDisplaySize(container.height*0.5, container.height*0.5);
    let imgWeapon, imgArmor;
    if (equip.weapon.ID != undefined) {
      imgWeapon = this.add.image(-container.width*0.025, -container.height*0.2, 'item'+equip.weapon.ID).setDisplaySize(container.height*0.5, container.height*0.5);
    } else {
      imgWeapon = this.add.image(-container.width*0.025, -container.height*0.2, 'blank').setDisplaySize(container.height*0.5, container.height*0.5);
    }
    if (equip.armor.ID != undefined) {
      imgArmor = this.add.image(container.width*0.325, -container.height*0.2, 'item'+equip.armor.ID).setDisplaySize(container.height*0.5, container.height*0.5);
    } else {
      imgArmor = this.add.image(430, 250, 'blank').setDisplaySize(container.height*0.5, container.height*0.5);
    }
    let imgStatusBg = this.add.image(container.width*0.15, container.height*0.3, 'UI').setDisplaySize(container.width*0.7,container.height*0.4);
    let playerStatus = {
      HP: this.add.text(imgStatusBg.x-imgStatusBg.displayWidth/2, imgStatusBg.y-imgStatusBg.displayHeight/2, 'HP: '+player.HP, { fontSize: imgStatusBg.displayHeight/4, fontStyle: 'bold' }).setPadding({ left: 8, top: 8 }),
      ATK: this.add.text(imgStatusBg.x-imgStatusBg.displayWidth/2, imgStatusBg.y-imgStatusBg.displayHeight/4, 'ATK: '+player.ATK, { fontSize: imgStatusBg.displayHeight/4, fontStyle: 'bold' }).setPadding({ left: 8, top: 8 })
    }
    container.add([imgBg,imgChar,imgWeaponBg,imgWeapon,imgArmorBg,imgArmor,imgStatusBg, playerStatus.HP, playerStatus.ATK]);

    //create item selection
    let itemList = [
      this.createItem(gameWidth/4, gameHeight*0.25, this.setRandom()),
      this.createItem(gameWidth/4*3, gameHeight*0.25, this.setRandom()),
      this.createItem(gameWidth/4, gameHeight*0.55, this.setRandom()),
      this.createItem(gameWidth/4*3, gameHeight*0.55, this.setRandom())
    ]

    this.input.on('gameobjectdown', function(pointer, gameObject) {
      if (gameObject.name == 'conPick') {
        if (gameObject.getData('pick')) {
          gameObject.setData('pick',false);
          //hide button and show item image
          gameObject.getByName('btnPick').setVisible(false);
          gameObject.getByName('txtPick').setVisible(false);
          gameObject.getByName('imgItem').setVisible(true);

          playerStatus.HP.setText('HP: ' + player.HP).clearTint();
          playerStatus.ATK.setText('ATK: ' + player.ATK).clearTint();

        } else {
          //hide item image and show button & status change
          for (let item of itemList) {
            if (item == gameObject) {
              item.setData('pick',true);
              item.getByName('btnPick').setVisible(true);
              item.getByName('txtPick').setVisible(true);
              item.getByName('imgItem').setVisible(false);
            } else {
              item.setData('pick',false);
              item.getByName('btnPick').setVisible(false);
              item.getByName('txtPick').setVisible(false);
              item.getByName('imgItem').setVisible(true);
            }
          }


          //call data variable
          let itemPART = gameObject.getByName('btnPick').getData('part');
          let itemHP = gameObject.getByName('btnPick').getData('hp');
          let itemATK = gameObject.getByName('btnPick').getData('atk');

          //initialize player status text
          playerStatus.HP.setText('HP: ' + player.HP).clearTint();
          playerStatus.ATK.setText('ATK: ' + player.ATK).clearTint();

          //show status change
          if (itemPART=='weapon') {
            playerStatus.HP.setText('HP: ' + (player.HP-equip.weapon.HP+itemHP));
            playerStatus.ATK.setText('ATK: ' + (player.ATK-equip.weapon.ATK+itemATK));

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
          } else if (itemPART=='armor') {
            playerStatus.HP.setText('HP: ' +  (player.HP-equip.armor.HP+itemHP));
            playerStatus.ATK.setText('ATK: ' + (player.ATK-equip.armor.ATK+itemATK));

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
          } else {
            //set button tint
            gameObject.setTint(0x606060);
          }
        }
      }
    }, this);
    this.input.on('gameobjectup', function(pointer, gameObject) {
      if (gameObject.name == 'conPick') { return; }
      //set tint to show it clearly
      gameObject.clearTint();
      //create item object & push into equip
      let item = {
        ID: gameObject.getData('id'),
        PART: gameObject.getData('part'),
        HP: gameObject.getData('hp'),
        ATK: gameObject.getData('atk')
      }
      switch (item.PART) {
        case 'weapon':
          player.HP += (item.HP-equip.weapon.HP);
          player.ATK += (item.ATK-equip.weapon.ATK);
          equip.weapon = item;
          break;
        case 'armor':
          player.HP += (item.HP-equip.armor.HP);
          player.ATK += (item.ATK-equip.armor.ATK);
          equip.armor = item;
          break;
      }
      console.log("item: ", item);
      console.log("equip: ", equip);
      //change scene with data(image and status)
      this.scene.start('third');
    }, this);
  }

  setRandom() {
    // item's status instance randomly
    let HP__item=0;
    let ATK__item=0;
    let part = Math.floor(Math.random()*4)+1;
    let part_what;
    if(part==1){
      ATK__item = Math.floor(Math.random()*2)+2*tier;
      part_what = "weapon";
    }
    else if(part==2){
      HP__item = Math.floor(Math.random()*3)+9*tier;
      part_what = "weapon";
    }
    else if(part==3){
      HP__item = Math.floor(Math.random()*3)+4*tier;
      ATK__item = Math.floor(Math.random()*2)+1*tier;
      part_what = "weapon";
    }
    else{
      ATK__item = Math.floor(Math.random()*2)+2*tier;
      part_what = "weapon";
    }

    let item = {
      ID: part,
      PART: part_what,
      HP: HP__item,
      ATK: ATK__item
    };
    return item;
  }

  createItem(x, y, item) {
    let container = this.add.container(x,y).setSize(gameWidth*0.5,gameHeight*0.3);
    let imgBg = this.add.image(0, 0, 'UI').setDisplaySize(container.width,container.height);
    let imgItem = this.add.image(0, -container.height*0.2, 'item'+item.ID).setDisplaySize(container.height*0.6,container.height*0.6).setName('imgItem');
    let imgStatusBg = this.add.image(0, container.height*0.3, 'UI').setDisplaySize(container.width, container.height*0.4);
    let txtStatus = this.add.text(-imgStatusBg.displayWidth/2, 0, [
      'PART: ' + item.PART,
      'HP: ' + item.HP,
      'ATK: ' + item.ATK
    ], { fontSize: imgStatusBg.displayHeight/4, fontStyle: 'bold' }).setPadding({ left: 8 });
    txtStatus.y = imgStatusBg.y - txtStatus.height/2;

    let btnSelect = this.add.image(0, -container.height*0.2, 'button').setDisplaySize(container.width/2,container.width/4).setInteractive();
    btnSelect.setName('btnPick').setVisible(false);
    btnSelect.setData({ id: item.ID, part: item.PART, hp: item.HP, atk: item.ATK });
    let txtSelect = this.add.text(0, 0, '선택', { fontSize: btnSelect.displayHeight/3, fontStyle: 'bold'});
    txtSelect.x = btnSelect.x - txtSelect.displayWidth/2;
    txtSelect.y = btnSelect.y - txtSelect.displayHeight/2;
    txtSelect.setName('txtPick').setVisible(false);

    container.add([imgBg, imgItem, imgStatusBg, txtStatus, btnSelect, txtSelect]);
    container.setName('conPick').setData('pick', false).setInteractive();

    return container;
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
      ATK : (level*1)+4+(tier*1)
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
    container.add(inventory);
    container.add(imgWeapon);
    container.add(imgArmor);

    //monster's status
    this.M__HP = this.add.text(-100, -80, 'M_HP: '+this.monster.HP, { fontsize: '40px', fill: '#000' });
    let M__ATK = this.add.text(-100, -40, 'M_ATK: '+this.monster.ATK, { fontsize: '40px', fill: '#000' });
    console.log(this.monster);
    container.add(this.M__HP);
    container.add(M__ATK);

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
        this.stageClear(true);
        this.fightEvent.remove(false);
      }
      this.turn = 'm';
    } else {
      this.playerHP -= this.monster.ATK;
      this.HP.setText('HP: ' + this.playerHP).setTintFill(0xff0000);
      if (this.playerHP<=0 && this.monsterHP>0) {
        this.stageClear(false);
        this.fightEvent.remove(false);
      }
      this.turn = 'p';
    }
  }

  //show ui when stage clear or fail
  stageClear(clear) {
    if (clear) {
      console.log('Win!');
      this.add.image(400, 200, 'win').setDisplaySize(400,300);

      this.add.image(400, 400, 'button').setDisplaySize(200,100).setInteractive();
      this.add.text(340, 385, '다음', { fontSize: 30, fontStyle: 'bold' });

      this.input.on('gameobjectover', function(pointer, button) {
        button.setTint(0xf0f0f0);
      });
      this.input.on('gameobjectout', function(pointer, button) {
        button.clearTint();
      });
      this.input.on('gameobjectdown', function(pointer, button) {
        level++;
        this.scene.start('second');
      }, this);

    } else {
      console.log('Fail...');
      this.add.image(400, 200, 'lose').setDisplaySize(400,300);

      let btnReplay = this.add.image(300, 400, 'button').setDisplaySize(200,100).setInteractive();
      this.add.text(240, 385, '다시시작', { fontSize: 30, fontStyle: 'bold' });
      let btnExit = this.add.image(500, 400, 'button').setDisplaySize(200,100).setInteractive();;
      this.add.text(440, 385, '게임종료', { fontSize: 30, fontStyle: 'bold' });
      btnReplay.name = 'replay';
      btnExit.name = 'exit';

      this.input.on('gameobjectover', function(pointer, button) {
        button.setTint(0xf0f0f0);
      });
      this.input.on('gameobjectout', function(pointer, button) {
        button.clearTint();
      });
      this.input.on('gameobjectdown', function(pointer, button) {
        player.init();
        equip.init();
        level = 1;
        tier = 1;
        switch (button.name) {
          case 'replay':
            this.scene.start('first');
            break;
          case 'exit':
            this.scene.start('intro');
            break;
        }
      }, this);

    }
  }

}

let config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
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
