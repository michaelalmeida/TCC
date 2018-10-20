// Global Variables
var
  game = new Phaser.Game(960, 640, Phaser.AUTO, 'game'),
  Main = function () {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer;

Main.prototype = {

  preload: function () {
    game.load.image('stars',    'assets/sprites/splash.jpg');
    game.load.image('loading',  'assets/sprites/loading.png');
    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
