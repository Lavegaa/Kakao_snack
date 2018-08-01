let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
let titleWidth = gameWidth/5*4;
let titleHeight = titleWidth;
let player = {
  ID: undefined,
  T_HP:true,
  HP: 0,
  ATK: 0,
  SPECIAL: '',
  init: function() {
    this.ID = undefined;
    this.T_HP = true,
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
let stage = 1;
let shp=0;
let satk=0;

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
      this.createCharacter(gameWidth/2, gameHeight/16*9, 1, 20, 6),
      this.createCharacter(gameWidth/2, gameHeight/16*9, 2, 15, 8),
      this.createCharacter(gameWidth/2, gameHeight/16*9, 3, 10, 10)
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
    let txtSelect = this.add.text(0, 0, '선택', { fontSize: btnSelect.displayHeight/3, fontStyle: 'bold'});
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
    let nav = this.add.container(gameWidth/2,gameHeight*0.05).setSize(gameWidth,gameHeight*0.1);
    let imgNavbg = this.add.image(0, 0, 'UI').setDisplaySize(nav.width, nav.height);
    let txtNav = this.add.text(0, 0,'아이탬을 고르세요', { fontSize: nav.height*0.3, fill: '#000' }).setPadding({ left: nav.width/20 });
    txtNav.x = -nav.width/2;
    txtNav.y = -txtNav.height/2 - nav.height/6;
    let txtNow = this.add.text(0, 0,'level: '+level+' stage : '+stage, { fontSize: nav.height*0.3, fill: '#000' }).setPadding({ left: nav.width/20 });
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
    this.createItem(gameWidth/4, gameHeight*0.25, this.setRandom());
    this.createItem(gameWidth/4*3, gameHeight*0.25, this.setRandom());
    this.createItem(gameWidth/4, gameHeight*0.55, this.setRandom());
    this.createItem(gameWidth/4*3, gameHeight*0.55, this.setRandom());

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
        }else if (itemPART == 'status'){
          playerStatus.HP.setText('HP: ' + (player.HP+itemHP));
          playerStatus.ATK.setText('ATK: ' + (player.ATK+itemATK));

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
        }
    }, this);
    this.input.on('gameobjectdown', function(pointer, button) {
      //set tint
      button.setTint(0x505050);

      //set status original
      playerStatus.HP.setText('HP: '+player.HP).clearTint();
      playerStatus.ATK.setText('ATK: '+player.ATK).clearTint();
    }, this);
    this.input.on('gameobjectup', function(pointer, button) {
      //set tint to show it clearly
      button.clearTint();
      //create item object & push into equip
      let item = {
        ID: button.name,
        PART: button.getData('part'),
        HP: button.getData('hp'),
        ATK: button.getData('atk')
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
        case 'status':
          player.HP += (item.HP);
          player.ATK += (item.ATK);
          shp += item.HP;
          satk += item.ATK;
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
      let part = Math.floor(Math.random()*100);
      let part_what;
      let special='';
      let special_key=Math.floor(Math.random()*2);

      if(part<35){
        ATK__item = Math.floor(Math.random()*2)+3*stage;
        part_what = "weapon";
      }
      else if(part<70){
        HP__item = Math.floor(Math.random()*3)+8*stage;
        part_what = "armor";
      }
      else if(part<90){
        if(part%2==0){
          HP__item = Math.floor(Math.random()*3)+2*stage;
          ATK__item = Math.floor(Math.random()*2)+2*stage;
          part_what = "weapon";
        }else{
          HP__item = Math.floor(Math.random()*8*stage)+2;
          ATK__item = Math.floor(Math.random()*2*stage)+1;
          part_what = "armor";
        }
      }else if(part<100){
        if(part%2==0){
          if(special_key==0){
            HP__item = Math.floor(Math.random()*3)+4*stage;
            ATK__item = Math.floor(Math.random()*2)+4*stage;
            part_what = "weapon";
            special='DAttack';
          }else{
            HP__item = Math.floor(Math.random()*3)+4*stage;
            ATK__item = Math.floor(Math.random()*2)+4*stage;       
            part_what = "weapon";
            special='GetHP';
          }
        }else{
          if(special_key==0){
            HP__item = Math.floor(Math.random()*3)+10*stage;
            ATK__item = Math.floor(Math.random()*2)+2*stage;
            part_what = "armor";
            special='Block';
          }else{
            HP__item = Math.floor(Math.random()*3)+10*stage;
            ATK__item = Math.floor(Math.random()*2)+2*stage;
            part_what = "armor";
            special='Evade';
          }
        }
      }
        
    let item = {
      ID: part,
      PART: part_what,
      HP: HP__item,
      ATK: ATK__item,
      SPECIAL : special
    };
    return item;
  }

  createItem(x, y, item) {
    let container = this.add.container(x,y).setSize(gameWidth*0.5,gameHeight*0.3);
    let imgBg = this.add.image(0, 0, 'UI').setDisplaySize(container.width,container.height);
    let imgItem = this.add.image(0, -container.height*0.2, 'item'+item.ID).setDisplaySize(container.height*0.6,container.height*0.6);
    let imgStatusBg = this.add.image(0, container.height*0.2, 'UI').setDisplaySize(container.width, container.height*0.5-container.width/6);
    let txtStatus = this.add.text(-imgStatusBg.displayWidth/2, 0, [
      'PART: ' + item.PART,
      'HP: ' + item.HP,
      'ATK: ' + item.ATK,
      'SPECIAL: ' + item.SPECIAL
    ], { fontSize: imgStatusBg.displayHeight/4, fontStyle: 'bold' }).setPadding({ left: 8 });
    txtStatus.y = imgStatusBg.y - txtStatus.height/2;

    let btnSelect = this.add.image(0, container.height*0.38, 'button').setDisplaySize(container.width/3,container.width/6).setInteractive();
    let txtSelect = this.add.text(0, 0, '선택', { fontSize: btnSelect.displayHeight/3, fontStyle: 'bold'});
    txtSelect.x = btnSelect.x - txtSelect.displayWidth/2;
    txtSelect.y = btnSelect.y - txtSelect.displayHeight/2;

    btnSelect.setName(item.ID);
    btnSelect.setData({ part: item.PART, hp: item.HP, atk: item.ATK });

    container.add([imgBg, imgItem, imgStatusBg, txtStatus, btnSelect, txtSelect]);

    return container;
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
    this.load.image('UI','img/status.png');
  }

  create() {
    //create container
    let container = this.add.container(gameWidth/2,gameHeight*0.85).setSize(gameWidth,gameHeight*0.3);
    //view status
    let status = this.add.image(0, 0, 'status').setDisplaySize(gameWidth-10,gameHeight/4);
    this.HP = this.add.text(-100, -60, 'HP: '+player.HP, { fontsize: '40px', fill: '#000' });
    let ATK = this.add.text(-100, -20, 'ATK: '+player.ATK, { fontsize: '40px', fill: '#000' });

    this.playerImg = this.add.sprite(100, 300, 'item1').setDisplaySize(100,100);

    this.monsterImg = this.add.sprite(300, 300, 'item1').setDisplaySize(100,100);

    this.anims.create({
      key: 'play',
      frames: [
          { key: 'item1' },
          { key: 'item2' },
          { key: 'item3' },
          { key: 'item4', duration: 50 }
      ],
      frameRate: 60,
      repeat: 0,
  });

    container.add(status);
    container.add(this.HP);
    container.add(ATK);

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
      monster.HP = (level*4) + (stage*3) + 1;
      monster.ATK = (level*2) + (stage*2) + 2;
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
      monster.HP = (level*2) + 15;
      monster.ATK = (level);
      monster.SPECIAL = '';
    }


    this.M__HP = this.add.text(80, -60, 'M_HP: '+monster.HP, { fontsize: '40px', fill: '#000' });
    let M__ATK = this.add.text(80, -20, 'M_ATK: '+monster.ATK, { fontsize: '40px', fill: '#000' });
    console.log(monster);
    container.add(this.M__HP);
    container.add(M__ATK);

    //fight event (per 1 second)
    if(player.T_hp){
      this.playerHP = player.HP;
      player.T_HP = false;
    }
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
  
      this.playerImg.play('play');
    
      if(equip.weapon.SPECIAL == 'DAttack' && lefthand<10){
        this.monsterHP -= player.ATK;
        console.log('DoubleAttack!');
      }else if(equip.weapon.SPECIAL == 'GetHP' && lefthand<99){
        player.HP += 3;
        this.HP.setText('HP: ' + player.HP).setTintFill(0x00ff00);
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
          player.HP = this.playerHP;
          player.T_HP=true;
          this.scene.start('second');
        }else{
          this.stageClear(true);
        }
      }
      this.turn = 'm';
    } else {
      
      this.monsterImg.play('play');

      if(equip.weapon.SPECIAL == 'Block' && lefthand<99){         //equip.armor.SPECIAL로 수정하기
        player.HP += 3;
        console.log('Block!');
      }else if(equip.weapon.SPECIAL == 'Evade' && lefthand<20){
        player.HP += this.monsterATK;
        console.log('Evade!');
      }

      player.HP -= this.monsterATK;

      if(this.monster.SPECIAL == 'DAttack' && lefthand<10){
        player.HP -= this.monsterATK;
      }else if(this.monster.SPECIAL == 'GetHP' && lefthand<10){
        this.monsterHP += 3;
      }
      
      this.HP.setText('HP: ' + player.HP).setTintFill(0xff0000);
      if (player.HP<=0 && this.monsterHP>0) {
        this.stageClear(false);
        this.fightEvent.remove(false);
      }
      this.turn = 'p';
    }
    console.log('fighting!', player.HP, this.monsterHP);

  }


  statRandom(){
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
    let status = {
      HP: HP__status,
      ATK: ATK__status
    }

    return status;
  }

  createStatus(x,y,status){
    let container = this.add.container(x,y).setSize(gameWidth*0.5,gameHeight*0.3);
    let imgBg = this.add.image(0, 0, 'UI').setDisplaySize(container.width,container.height);
    let imgStatusBg = this.add.image(0, container.height*0.2, 'UI').setDisplaySize(container.width, container.height*0.5-container.width/6);
    let txtStatus = this.add.text(-imgStatusBg.displayWidth/2, 0, [
      'HP: ' + status.HP,
      'ATK: ' + status.ATK,
    ], { fontSize: imgStatusBg.displayHeight/4, fontStyle: 'bold' }).setPadding({ left: 8 });
    txtStatus.y = imgStatusBg.y - txtStatus.height/2;

    let btnSelect = this.add.image(0, container.height*0.38, 'button').setDisplaySize(container.width/3,container.width/6).setInteractive();
    let txtSelect = this.add.text(0, 0, '선택', { fontSize: btnSelect.displayHeight/3, fontStyle: 'bold'});
    txtSelect.x = btnSelect.x - txtSelect.displayWidth/2;
    txtSelect.y = btnSelect.y - txtSelect.displayHeight/2;

    btnSelect.setName(status.ID);
    btnSelect.setData({hp: status.HP, atk: status.ATK });

    container.add([imgBg, imgStatusBg, txtStatus, btnSelect, txtSelect]);

    return container;
  }
  //show ui when stage clear or fail
  stageClear(clear) {
    if (clear) {

      this.createStatus(gameWidth/4, gameHeight*0.25, this.statRandom());
      this.createStatus(gameWidth/4*3, gameHeight*0.25, this.statRandom());
      this.createStatus(gameWidth/4, gameHeight*0.55, this.statRandom());
      this.createStatus(gameWidth/4*3, gameHeight*0.55, this.statRandom());

      
      this.input.on('gameobjectdown', function(pointer, gameObject) {
        let status = {
          ID: gameObject.name,
          HP: gameObject.getData('hp'),
          ATK: gameObject.getData('atk'),
        }
        player.HP += status.HP;
        this.playerHP += status.HP;
        player.ATK += status.ATK;
        this.scene.start('third');
        level++;
        console.log('total: '+ this.playerHP + ' now:'+ player.HP);
        

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
        stage = 1;

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
