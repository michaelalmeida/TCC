// Global variables
var game;
var mic; //P5 Lib
var vol;
var counter = 0;
var countWin = 0;
var paciente;
var score = 0;

var todayIs = new Date();
var day = todayIs.getDate();
var month = todayIs.getMonth() + 1;
var year = todayIs.getFullYear();
var dmy =  day + "/" + month + "/" + year;

var database = firebase.database();

var playGame = function (game) { };

window.onload = function () {
  game = new Phaser.Game(960, 640, Phaser.AUTO, "");
  game.state.add("PlayGame", playGame);
  game.state.start("PlayGame");
}
//This is a object
playGame.prototype = {
  // This is a method
  preload: function () {
    game.load.image("airplane", "assets/sprites/airplane.png");
    game.load.image("particle", "assets/sprites/particle.png");
    game.load.image("play", "assets/sprites/letsplay.png");
    game.load.image("sky", "assets/sprites/sky.png");
    game.load.tilemap("level_0001", "assets/maps/level_0001.json", null, Phaser.Tilemap.TILED_JSON);
    game.load.image("deadly", "assets/maps/tiles/deadly.png");
    game.load.image("hands", "assets/sprites/hands_congrats.png");
    game.load.spritesheet('button', 'assets/sprites/button.png', 300, 70);
    // volume bar
    game.load.image("vol_bar_01", "assets/sprites/vol_bar_01.png");
    game.load.image("vol_bar_02", "assets/sprites/vol_bar_02.png");
    game.load.image("vol_bar_03", "assets/sprites/vol_bar_03.png");
    game.load.image("vol_bar_04", "assets/sprites/vol_bar_04.png");
    game.load.image("vol_bar_05", "assets/sprites/vol_bar_05.png");
    // confete
    game.load.image("confete_blue", "assets/sprites/confete_blue.png");
    game.load.image("confete_yellow", "assets/sprites/confete_yellow.png");
    game.load.image("confete_rose", "assets/sprites/confete_rose.png");
  },
  create: function () {
    // Text 
    var style = { font: "36px Arial", fill: "#ff0044", align: "center" };
    mic = new p5.AudioIn();
    // Game scale (size wxh)
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // Background
    bg = game.add.tileSprite(0, 0, 960, 640, 'sky');
    // Collision
    this.map = game.add.tilemap("level_0001");
    this.map.addTilesetImage("deadly", "deadly");
    this.map.setCollision(1);
    this.mapLayer = this.map.createLayer("Tile Layer 1");
    this.emitter = game.add.emitter(50, game.height / 2, 50);
    this.emitter.makeParticles("particle");
    this.emitter.gravity = 0;
    this.emitter.setXSpeed(0, 0);
    this.emitter.setYSpeed(0, 0);
    this.emitter.setAlpha(0.5, 1);
    this.emitter.minParticleScale = 0.5;
    this.emitter.maxParticleScale = 1;
    // Set the airnplane paper
    this.airplane = game.add.sprite(50, 250, "airplane");
    this.airplane.anchor.set(0.5);
  
    // The initial image for start the game
    playImg = game.add.sprite(50, game.height / 2, "play");
    playImg.anchor.setTo(-0.5, 0.5);
    playImg.alpha = 0;
    game.add.tween(playImg).to({ alpha: 1 }, 500, "Linear", true);

    playImg.inputEnabled = true;
    game.physics.enable(this.airplane, Phaser.Physics.ARCADE);
    playImg.events.onInputDown.add(this.startLevel, this);
    //game.input.onDown.add(this.startLevel, this);
    this.gameOver = false;
    
    button = game.add.button(game.height / 2, 490, 'button', this.openPlayerName, this, 1, 0, 0);
    
    //winImage.alpha = 0;
    // Volume bar
    vol_bar_01 = game.add.sprite(0, 0, "vol_bar_01");
    vol_bar_02 = game.add.sprite(0, 0, "vol_bar_02");
    vol_bar_03 = game.add.sprite(0, 0, "vol_bar_03");
    vol_bar_04 = game.add.sprite(0, 0, "vol_bar_04");
    vol_bar_05 = game.add.sprite(0, 0, "vol_bar_05");
  },
  startLevel: function () {
    game.add.tween(playImg).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(playImg.scale).to({ x: 0, y: 0 }, 1000, Phaser.Easing.Linear.None, true);
    this.airplane.body.velocity.setTo(100, 0);
    this.emitter.start(false, 3000, 200);
    mic.start();
    // When the user click to start the game, the start level will be removed
    game.input.onDown.remove(this.startLevel, this);
    counter = 0;
    countWin = 0;
    game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
    // Name and form
    if(localStorage.getItem("paciente") == null) {
      localStorage.setItem("paciente", "anonimo");
    }
    paciente = localStorage.getItem("paciente");
    button.destroy();
  },
  engineOn: function () {
    vol_bar_01.alpha = 0;
    vol_bar_02.alpha = 0;
    vol_bar_03.alpha = 0;
    vol_bar_04.alpha = 0;
    vol_bar_05.alpha = 0;
    vol = mic.getLevel(); 

    if ((vol * 100 > 2) && (vol * 100 < 10)) {
      this.airplane.body.velocity.y = -10;
      vol_bar_03.alpha = 1;
      score++;
    } else if ((vol != 0) && (vol * 100 < 1)) {
      vol_bar_01.alpha = 1;
      this.airplane.body.velocity.y = 60;
    } else if ((vol != 0) && (vol * 100 < 2)) {
      vol_bar_02.alpha = 1;
      this.airplane.body.velocity.y = 60;
    } else if ((vol != 0) && (vol * 100 < 15)) {
      vol_bar_04.alpha = 1;
      this.airplane.body.velocity.y = 60;
    } else if ((vol != 0) && (vol * 100 > 15)) {
      vol_bar_05.alpha = 1;
      this.airplane.body.velocity.y = -60;
    }
  },
  winGame: function () {
    if (countWin == 1) {
      // Stop microphone recording
      mic.stop();
      // Confete
      emitter = game.add.emitter(game.world.centerX, -200, 200);
      emitter.makeParticles(['confete_blue', 'confete_yellow', 'confete_rose']);
      emitter.start(false, 5000, 20);
      // Image shawn when the user win
      winImage = game.add.sprite(game.height / 2, -200, "hands");
      winImage.anchor.setTo(-0.1, 0.5);
      game.add.tween(winImage).to( { y: game.height / 2 }, 4000, Phaser.Easing.Bounce.Out, true);
    }
  },
  updateCounter: function() {
    counter++;
  },
  saveDb : function(name, date, time, result, score) {
    if (countWin == 1) {
      // Function used to save the game statistic
      firebase.database().ref('pacientes/' + name).push({
        data: date,
        duracao: time,
        ganhou: result,
        pontuacao: score
      });
    }
  },
  openPlayerName : function() {
    document.getElementById("form").style.display = "block";
  },
  update: function () {
    // Call the engineOn fuction
    this.engineOn();
    // Animation for the background
    bg.tilePosition.x -= 1;
    if (!this.gameOver) {
      // if the user lost
      game.physics.arcade.collide(this.airplane, this.mapLayer, function () {
        this.emitter.on = false;
        var explosion = game.add.emitter(this.airplane.x, this.airplane.y, 200);
        explosion.makeParticles("particle");
        explosion.gravity = 200;
        explosion.setXSpeed(-150, 150);
        explosion.setYSpeed(-150, 150);
        explosion.setAlpha(0.5, 1);
        explosion.minParticleScale = 0.2;
        explosion.maxParticleScale = 0.5;
        explosion.start(true, 3000, null, 200);
        this.airplane.kill();
        this.gameOver = true;
        mic.stop();
        game.time.events.add(Phaser.Timer.SECOND * 5, function () {
          countWin++;
          // Save the score
          this.saveDb(paciente, dmy, counter, "não", score);
          //this.text.setText("Você perdeu! Levou:" + counter);
          game.state.start("PlayGame");
          score = 0;
        }, this);
      }, null, this);
      this.emitter.x = this.airplane.x;
      this.emitter.y = this.airplane.y;
      // if the user win
      if (this.airplane.x > game.width + this.airplane.width) {   
        countWin++;
        // Save the score
        this.saveDb(paciente, dmy, counter, "sim", score);
        // Win animation
        this.winGame();
        // Play next
        game.time.events.add(Phaser.Timer.SECOND * 10, function () {
          game.state.start("PlayGame");
          score = 0;
        }, this);
      }
    }
  }
}