let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
let player = {
  ID: undefined,
  HP: 0,
  ATK: 0,
  SPECIAL: '',
  init: function() {
    this.ID = undefined;
    this.HP = 0;
    this.ATK = 0;
    this.SPECIAL = '';
  }
};
let equip = {
  weapon: {
    ID: undefined,
    PART: "weapon",
    HP: 0,
    ATK: 0,
    SPECIAL:''
  },
  armor: {
    ID: undefined,
    PART: "armor",
    HP: 0,
    ATK: 0,
    SPECIAL:''
  },
  status: {
    ID: undefined,
    PART: "status",
    HP: 0,
    ATK: 0,
  },
  init: function() {
    this.weapon = {
      ID: undefined,
      PART: "weapon",
      HP: 0,
      ATK: 0,
      SPECIAL:''
    },
    this.armor = {
      ID: undefined,
      PART: "armor",
      HP: 0,
      ATK: 0,
      SPECIAL:''
    },
    this.status = {
      ID: undefined,
      PART: "status",
      HP: 0,
      ATK: 0,
    }
  }
};
let level = 1;
let tier = 1;
let stage = 0;
let shp=0;
let satk=0;
let sdef=0;

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
    this.add.image(gameWidth/2, gameHeight/2, 'bg').setDisplaySize(gameWidth, gameHeight);
    this.add.image(gameWidth/2, 300, 'title').setDisplaySize(gameWidth*0.8,400);

    let btnStart = this.add.image(gameWidth/2-200 , gameHeight-300, 'button').setDisplaySize(400,200).setInteractive();
    btnStart.name = 'start';
    let txtStart = this.add.text(0, 0, '게임시작', { fontSize: '40px', fontStyle: 'bold'});
    txtStart.x = btnStart.x - txtStart.width/2;
    txtStart.y = btnStart.y - txtStart.height/2;
    let btnHow = this.add.image(gameWidth/2+200, gameHeight-300, 'button').setDisplaySize(400,200).setInteractive();
    btnHow.name = 'how';
    let txtHow = this.add.text(0, 0, '게임방법', { fontSize: 40, fontStyle: 'bold'});
    txtHow.x = btnHow.x - txtHow.width/2;
    txtHow.y = btnHow.y - txtHow.height/2;

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
  }
  create() {
    this.input.manager.enabled = true;
    //create character selection
    this.add.image(0,0, 'UI').setDisplaySize(gameWidth, 200);
    this.nav1 = this.add.text(16,16,'Choose your character', { fontSize: '32px', fill: '#000' });

    this.platforms = this.physics.add.staticGroup();
    let charList = []
    for (let i=0; i<4; i++) {
      let char = this.platforms.create(160*(i+1),this.platformY,'char'+(i+1)).setScale(0.5).setInteractive().setTint(505050);
      char.setName(i+1);
      charList.push(char);
    }
    charList[0].setData({
      hp: 20, atk: 6
    });
    charList[1].setData({
      hp: 10, atk: 10
    });
    charList[2].setData({
      hp: 15, atk: 8
    });
    charList[3].setData({
      hp: 12, atk: 6
    });

    this.input.on('gameobjectover', function(pointer, gameObject) {
      gameObject.clearTint();
    }, this);
    this.input.on('gameobjectout', function(pointer, gameObject) {
      gameObject.setTint(505050);
    }, this);
    this.input.on('gameobjectdown', function(pointer, gameObject) {
      player.ID = gameObject.name;
      player.HP = gameObject.getData('hp');
      player.ATK = gameObject.getData('atk');
      
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
    console.log(player.ID);
    this.load.image('player'+player.ID,'img/character'+player.ID+'.png');
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
    this.add.image(150, this.playerY, 'player'+player.ID).setDisplaySize(300,320);
    this.add.image(550, this.playerY, 'status').setDisplaySize(500,320);
    if(level%5==0){
      tier++;
    }
    let playerStatus = {
      Now: this.add.text(330, 60, 'level: '+level+' tier : '+tier ,{ fontSize: '20px', fill: '#000' }),
      HP: this.add.text(330, 80, 'HP: '+player.HP, { fontSize: '20px', fill: '#000' }),
      ATK: this.add.text(330, 100, 'ATK: '+player.ATK, { fontSize: '20px', fill: '#000' }),
      SPECIAL: this.add.text(330, 120, 'SPECIAL: '+equip.weapon.SPECIAL, { fontSize: '20px', fill: '#000' }),
      WHP: this.add.text(430, 80, 'WHP: '+equip.weapon.HP, { fontSize: '20px', fill: '#000' }),
      WATK: this.add.text(430, 100, 'WATK: '+equip.weapon.ATK, { fontSize: '20px', fill: '#000' }),
      AHP: this.add.text(530, 80, 'AHP: '+equip.armor.HP, { fontSize: '20px', fill: '#000' }),
      AATK: this.add.text(530, 100, 'AATK: '+equip.armor.ATK, { fontSize: '20px', fill: '#000' }),
      SHP: this.add.text(630, 80, 'SHP: '+shp, { fontSize: '20px', fill: '#000' }),
      SATK: this.add.text(630, 100, 'SATK: '+satk , { fontSize: '20px', fill: '#000' })
    }

    this.add.image(430, 250, 'inventory').setDisplaySize(220,220);
    this.add.image(670, 250, 'inventory').setDisplaySize(220,220);
    let imgWeapon, imgArmor;
    if (equip.weapon.ID != undefined) {
      imgWeapon = this.add.image(430, 250, 'item'+equip.weapon.ID).setDisplaySize(200,200);
    }
    if (equip.armor.ID != undefined) {
      imgArmor = this.add.image(430, 250, 'item'+equip.armor.ID).setDisplaySize(200,200);
    }

    //create item selection
    this.platforms = this.physics.add.staticGroup();
    let itemList = [];
    for (let i=0; i<4; i++) {
      this.platforms.create(100+200*i, this.platformY,'select').setDisplaySize(200,200);
      let item = this.platforms.create(100+200*i,this.platformY,'item'+(i+1)).setDisplaySize(180,180).setInteractive().setTint(505050);
      item.setName(i+1);
      item.setData('part','weapon');
      itemList.push(item);
    }
    // item's status instance randomly

//==================================================ITEM===========================================================
//==================================================ITEM===========================================================
//==================================================ITEM===========================================================
//==================================================ITEM===========================================================
//==================================================ITEM===========================================================
//==================================================ITEM===========================================================
//==================================================ITEM===========================================================

    for(let i=0; i<4; i++){
      let HP__item=0;
      let ATK__item=0;
      let HP__status=0;
      let ATK__status=0;
      let part = Math.floor(Math.random()*4)+1;
      let part_what;
      let special='';
      let special_key=Math.floor(Math.random()*99);
      let drop_special=20;

      if(part==1){
        ATK__item = Math.floor(Math.random()*2)+3*tier;
        part_what = "weapon";
      }
      else if(part==2){
        HP__item = Math.floor(Math.random()*3)+8*tier;
        part_what = "armor";
      }
      else if(part==3){
        HP__item = Math.floor(Math.random()*3)+2*tier;
        ATK__item = Math.floor(Math.random()*2)+2*tier;
        part_what = "weapon";
      }
      else{
        HP__item = Math.floor(Math.random()*8*tier)+2;
        ATK__item = Math.floor(Math.random()*2*tier)+1;
        part_what = "armor";
      }

      if(special_key<drop_special && part_what=="weapon"){
        special='DAttack';
      }else if(special_key<drop_special && part_what=="weapon"){
        special='GetHP';
      }else if(special_key<drop_special && part_what=="weapon"){
        special='Block';
      }else if(special_key<drop_special && part_what=="weapon"){
        special='Evade';
      }

      itemList[i].setData({
        hp : HP__item,
        atk : ATK__item,
        part : part_what,
        special : special
      });

      let item = this.add.text(50+180*i, 360, [
        'HP: ' + HP__item,
        'ATK: ' + ATK__item,
        'SPECIAL: '+ special
      ], { fontsize: '40px', fill: '#000' });

      console.log('hp :' +HP__item + ' atk : ' + ATK__item +' special:'+special+' special_key: '+special_key);
      

    }//set random status end
    this.input.on('gameobjectover', function(pointer, gameObject) {
      //clear item tint
      gameObject.clearTint();

      //call data variable
      let itemPART = gameObject.getData('part');
      let itemHP = gameObject.getData('hp');
      let itemATK = gameObject.getData('atk');

      //show status change
        if (itemPART=='weapon') {
          playerStatus.HP.setText('HP: ' + (player.HP-equip.weapon.HP+itemHP));
          playerStatus.ATK.setText('ATK: ' + (player.ATK-equip.weapon.ATK+itemATK))  
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
          playerStatus.HP.setText('HP: ' + (player.HP-equip.armor.HP+itemHP));
          playerStatus.ATK.setText('ATK: ' + (player.ATK-equip.armor.ATK+itemATK))  
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
        }
      
      

    }, this);
    this.input.on('gameobjectout', function(pointer, gameObject) {
      //set tint to show it clearly
      gameObject.setTint(505050);

      //set status original
      playerStatus.HP.setText('HP: '+player.HP).clearTint();
      playerStatus.ATK.setText('ATK: '+player.ATK).clearTint();

    }, this);
    this.input.on('gameobjectdown', function(pointer, gameObject) {
      //create item object & push into equip
      let item = {
        ID: gameObject.name,
        PART: gameObject.getData('part'),
        HP: gameObject.getData('hp'),
        ATK: gameObject.getData('atk'),
        SPECIAL: gameObject.getData('special')
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
}



class FightScene extends Phaser.Scene {
  constructor() {
    super({ key: 'third' });
  }
  //get data from pre scene
  init() {
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

//===============================================MONSTER=============================================================================
//===============================================MONSTER=============================================================================
//===============================================MONSTER=============================================================================
//===============================================MONSTER=============================================================================
//===============================================MONSTER=============================================================================
//===============================================MONSTER=============================================================================

    let monster = {
      HP : 0,
      ATK : 0,
      SPECIAL : ''
    }
    //monster's status
    if(level%4 == 0){
      let Boss_special = Math.floor(Math.random()*4);
      monster.HP = (level*4) + (stage*3) + 13;
      monster.ATK = (level*2) + (stage*2) + 4;
      if(Boss_special == 0){
        monster.SPECIAL = 'DAttack';
      }else if(Boss_special == 1){
        monster.SPECIAL = 'GetHP';
      }else if(Boss_special == 2){
        monster.SPECIAL='Block';
      }else if(Boss_special == 3){
        monster.SPECIAL='Evade';
      }

    }else{ 
      monster.HP = (level*3) + (stage*3) + 15;
      monster.ATK = (level*2) + (stage*2) + 3;
      monster.SPECIAL = '';
    }


    this.M__HP = this.add.text(-100, -80, 'M_HP: '+monster.HP, { fontsize: '40px', fill: '#000' });
    let M__ATK = this.add.text(-100, -40, 'M_ATK: '+monster.ATK, { fontsize: '40px', fill: '#000' });
    console.log(monster);
    container.add(this.M__HP);
    container.add(M__ATK);

    //fight event (per 1 second)
    this.playerHP = player.HP;
    this.monsterHP = monster.HP;
    this.monsterATK = monster.ATK;
    this.monster = monster;
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
    let lefthand = Math.floor(Math.random()*99);
    if (this.turn == 'p') {

      if(equip.weapon.SPECIAL == 'DAttack' && lefthand<10){
        this.monsterHP -= player.ATK;
        console.log('DoubleAttack!');
      }else if(equip.weapon.SPECIAL == 'GetHP' && lefthand<99){
        this.playerHP += 3;
        this.HP.setText('HP: ' + this.playerHP).setTintFill(0x00ff00);
        console.log('GetHP +3');       
      }

      this.monsterHP -= player.ATK;

      if(this.monster.SPECIAL == 'Block' && lefthand<10){
        this.monsterHP += 3;
      }else if(this.monster.SPECIAL == 'Evade' && lefthand<10){
        this.monsterHP += player.ATK;
      }


      this.M__HP.setText('M_HP: ' + this.monsterHP).setTintFill(0xff0000);
      if (this.monsterHP<=0) {
        this.fightEvent.remove(false);
        if(level%4 == 0){
          level++;
          stage++;
          this.scene.start('second');
        }else{
          this.stageClear(true);
        }
      }
      this.turn = 'm';
    } else {

      if(equip.weapon.SPECIAL == 'Block' && lefthand<99){         //equip.armor.SPECIAL로 수정하기
        this.playerHP +=3;
        console.log('Block!');
      }else if(equip.weapon.SPECIAL == 'Evade' && lefthand<20){
        this.playerHP += this.monsterATK;
        console.log('Evade!');
      }

      this.playerHP -= this.monsterATK;

      if(this.monster.SPECIAL == 'DAttack' && lefthand<10){
        this.playerHP -= this.monsterATK;
      }else if(this.monster.SPECIAL == 'GetHP' && lefthand<10){
        this.monsterHP += 3;
      }


      this.HP.setText('HP: ' + this.playerHP).setTintFill(0xff0000);
      if (this.playerHP<=0 && this.monsterHP>0) {
        this.stageClear(false);
        this.fightEvent.remove(false);
      }
      this.turn = 'p';
    }
    console.log('fighting!', this.playerHP, this.monsterHP);

  }
  //show ui when stage clear or fail
  stageClear(clear) {
    if (clear) {

      this.platforms = this.physics.add.staticGroup();
      let statusList = [];
      for (let i=0; i<4; i++) {
        this.platforms.create(100+200*i, this.platformY,'select').setDisplaySize(200,200);
        let stat = this.platforms.create(100+200*i,this.platformY,'status'+(i+1)).setDisplaySize(180,180).setInteractive().setTint(505050);
        stat.setName(i+1);
        stat.setData('part','weapon');
        statusList.push(stat);

        let ATK__status = 0;
        let HP__status = 0;
        let ranStatus = Math.floor(Math.random()*3);

//=================================================STATUS=========================================================================
//=================================================STATUS=========================================================================
//=================================================STATUS=========================================================================
//=================================================STATUS=========================================================================
//=================================================STATUS=========================================================================
//=================================================STATUS=========================================================================

        if(ranStatus==0){
          ATK__status = Math.floor(Math.random()*2)+1+1*stage;
        }
        else if(ranStatus==1){
          HP__status = Math.floor(Math.random()*3)+1+2*stage;
        }
        else if(ranStatus==2){
          HP__status = Math.floor(Math.random()*2)+1+1*stage;
          ATK__status = Math.floor(Math.random()*1)+1+1*stage;
        }
        statusList[i].setData({
          hp : HP__status,
          atk : ATK__status,
        });

        let status = this.add.text(50+180*i, 350, [
          'HP: ' + HP__status,
          'ATK: ' + ATK__status,
        ], { fontsize: '40px', fill: '#000' });
      }

      this.input.on('gameobjectdown', function(pointer, gameObject) {
        let status = {
          ID: gameObject.name,
          HP: gameObject.getData('hp'),
          ATK: gameObject.getData('atk'),
        }
        player.HP += status.HP;
        player.ATK += status.ATK;
        this.scene.start('third');
        level++;
        

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