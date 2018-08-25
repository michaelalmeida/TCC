var game;
var mic; //P5 Lib
var vol;

window.onload = function() {
	game = new Phaser.Game(960, 640, Phaser.AUTO, "");
  game.state.add("PlayGame", playGame);
  game.state.start("PlayGame");
}


var countWin = 0;

var playGame = function(game){};

playGame.prototype = {
     preload: function(){
          game.load.image("spaceship", "assets/sprites/spaceship.png");
          game.load.image("particle", "assets/sprites/particle.png");
          game.load.image("play", "assets/sprites/letsplay.png");
          game.load.image("sky", "assets/sprites/sky.png");
          game.load.tilemap("level_0001", "assets/maps/level_0001.json", null, Phaser.Tilemap.TILED_JSON);
          game.load.image("deadly", "assets/maps/tiles/deadly.png");

          game.load.image("congrats", "assets/sprites/congrats.png");
         
         game.load.spritesheet('play', 'assets/sprites/letsplay.png', 400, 306, 3);


         
     },
     create: function(){
    
          var style = { font: "25px Arial", fill: "#ff0044", align: "center" };

          mic = new p5.AudioIn();
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
          bg = game.add.tileSprite(0, 0, 960, 640, 'sky');

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
          // Text for log mic get level
          this.text = game.add.text(game.world.centerX, game.world.centerY, "Level do microfone", style);
          this.text.anchor.set(0.1);
          
          this.spaceship = game.add.sprite(50, game.height / 2, "spaceship");
          this.spaceship.anchor.set(0.5); 
          game.physics.enable(this.spaceship, Phaser.Physics.ARCADE);
          game.input.onDown.add(this.startLevel, this); 
          this.gameOver = false;   

          playImg = game.add.sprite(50, game.height / 2, "play");
          playImg.anchor.setTo(-0.5, 0.5);
          playImg.alpha = 0;
          game.add.tween(playImg).to( { alpha: 1 }, 500, "Linear", true);

          winImage = game.add.sprite(50, game.height / 2, "congrats");
          winImage.anchor.setTo(-0.5, 0.5);
          winImage.alpha = 0;
     },
     startLevel: function(){
          game.add.tween(playImg).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
          game.add.tween(playImg.scale).to( { x: 0, y:0 }, 1000, Phaser.Easing.Linear.None, true);
          this.spaceship.body.velocity.setTo(80, 0);
          //this.spaceship.body.gravity.y = 50;
          this.emitter.start(false, 3000, 200);
          mic.start();
        
        game.input.onDown.remove(this.startLevel, this); 
     },
     engineOn: function(){
        
          vol = mic.getLevel();
          this.text.setText(vol);
          if((vol*100 > 2) && (vol*100 < 10)) {
            //this.spaceship.y = 320;
            //this.spaceship.body.acceleration.y = vol*-1000;
            this.spaceship.body.velocity.y = -20;
            this.text.setText("Continue asim!");
          } else if (vol != 0) {
            //this.spaceship.body.acceleration.y = vol*-3000;
            this.spaceship.body.velocity.y = 50;
            this.text.setText("Hmm..");
          }

          
     },
     winGame: function() {
      if(countWin == 1) {
        mic.stop();
        game.add.tween(winImage).to( { alpha: 1 }, 500, "Linear", true);
        game.add.tween(winImage).from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);
        this.text.setText("Você ganhou");
		    countWin=0;
      }
    },
    update: function(){ 
      this.engineOn();
      bg.tilePosition.x -= 1;
      //this.play.scale.setTo(1.1, 1.1);

          if(!this.gameOver){
               game.physics.arcade.collide(this.spaceship, this.mapLayer, function(){
                    this.emitter.on = false;
                    var explosion = game.add.emitter(this.spaceship.x, this.spaceship.y, 200);
                    explosion.makeParticles("particle");
                    explosion.gravity = 200;
                    explosion.setXSpeed(-150, 150);
                    explosion.setYSpeed(-150, 150);
                    explosion.setAlpha(0.5, 1);
                    explosion.minParticleScale = 0.2;
                    explosion.maxParticleScale = 0.5;  
                    explosion.start(true, 3000, null, 200);
                    this.spaceship.kill();
                    this.gameOver = true; 
                    mic.stop();
                    game.time.events.add(Phaser.Timer.SECOND * 2, function(){
                         game.state.start("PlayGame");
                    }, this);
               }, null, this); 

               this.emitter.x = this.spaceship.x;
               this.emitter.y = this.spaceship.y;
               
               if(this.spaceship.x > game.width + this.spaceship.width){
                  countWin++;
                  this.winGame();
                game.time.events.add(Phaser.Timer.SECOND * 2, function(){
                  game.state.start("PlayGame");
                }, this);
                    
               }
          }

          
     }
}