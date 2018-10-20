var Options = function(game) {};

Options.prototype = {

  menuConfig: {
    className: "inverse",
    startY: 260,
    startX: "center"
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, " ", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },
  create: function () {
    var playSound = gameOptions.playSound,
        playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'options-bg');
    game.add.existing(this.titleText);

    this.addMenuOption('VOLTAR', function () {
      game.state.start("GameMenu");
    });
  }
};

Phaser.Utils.mixinPrototype(Options.prototype, mixins);
