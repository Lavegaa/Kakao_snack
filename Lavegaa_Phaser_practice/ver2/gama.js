var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);

function player (){
    this.hp = 10;
    this.atk = 2;
    this.dfs = 5;

    this.getHp = function(){
        return this.hp;
    }
    this.getAtk = function(){
        return this.atk;
    }
    this.getDfs = function(){
        return this.dfs;
    }

    this.plusHp = function(num){
        console.log(num);
        this.hp = this.hp+num;
        return this.hp;
    }
    this.plusAtk = function(num){
        console.log(num);
        this.atk = this.atk+num;
        return this.atk;
    }
    this.plusDfs = function(num){
        console.log(num);
        this.dfs = this.dfs+num;
        return this.dfs;
    }

}

let lavega = new player();
let style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
let level = 1;
let isPick = false;
let card;
let ranNum;
let upNum_1;
let upNum_2;
let upNum_3;
let ranNum_1;
let ranNum_2;
let ranNum_3;
let text_hp;
let text_atk;
let text_dfs;

function preload ()
{
    this.load.image('eye', 'assets/up.png');

}
function doUp(ranNum,upNum){
    if(ranNum==1){
        lavega.plusHp(upNum);
        text_hp.setText("Hp :" + lavega.getHp());
    }
    else if(ranNum==2){
        lavega.plusAtk(upNum);
        text_atk.setText("Attack :" + lavega.getAtk());
    }
    else{
        lavega.plusDfs(upNum);
        text_dfs.setText("Defense :" + lavega.getDfs());
    }
    level++;
}

function random(key){

    let ranNum = Math.floor(Math.random()*3)+1;
    let upNum;
    
    if(ranNum==1){
        upNum = Math.floor(Math.random()*5)+level+1;
        card='Hp';
    }
    else if(ranNum==2){
        upNum = Math.floor(Math.random()*3)+level+1;
        card='Attack';
    }
    else{
        upNum = Math.floor(Math.random()*2)+level+1;
        card='Defense';
    }

    if(key==1){
        upNum_1 = upNum;
        ranNum_1 = ranNum;
    }else if(key==2){
        upNum_2 = upNum;
        ranNum_2 = ranNum;
    }else{
        upNum_3 = upNum;
        ranNum_3 = ranNum;
    }
}



function create ()
{   
    text_hp = this.add.text(0,0,"Hp :" + lavega.getHp() ,style);
    text_atk = this.add.text(0,25,"Attack :" + lavega.getAtk() ,style);
    text_dfs = this.add.text(0,50,"Defense :" + lavega.getDfs() ,style);
    
    random(1);
    this.button_1 = this.add.text(60,150, card +" : +" + upNum_1 , style);
    var sprite_1 = this.add.sprite(150, 300, 'eye').setInteractive();
    sprite_1.on('pointerdown', function (pointer){
        doUp(ranNum_1,upNum_1);
    });

    random(2);
    this.button_2 = this.add.text(300,150, card +" : +" + upNum_2 , style);
    var sprite_2 = this.add.sprite(400, 300, 'eye').setInteractive();
    sprite_2.on('pointerdown', function (pointer){
        doUp(ranNum_2,upNum_2);
    });

    random(3);
    this.button_2 = this.add.text(550,150, card +" : +" + upNum_3 , style);
    var sprite_2 = this.add.sprite(650, 300, 'eye').setInteractive();
    sprite_2.on('pointerdown', function (pointer){
        doUp(ranNum_3,upNum_3);
    });
}



function update ()
{
    
}