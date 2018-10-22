// Global Variables
var scaleRatio = window.devicePixelRatio / 3;
var game = new Phaser.Game(960, 640, Phaser.AUTO, ""),
  //var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'game');
  Main = function () {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer;

Main.prototype = {

  preload: function () {
    game.load.image('stars',    'assets/images/splash.jpg');
    game.load.tilemap("level_0001", "assets/maps/level_0001.json", null, Phaser.Tilemap.TILED_JSON);
    //stars.scale.setTo(scaleRatio, scaleRatio);
    game.load.image('loading',  'assets/images/loading.png');
    //loading.scale.setTo(scaleRatio, scaleRatio);
    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/Splash.js');
  },

  create: function () {
    // Game scale (size wxh)
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
