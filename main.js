import screen1 from "./scenes/screen1.js";
import screen2 from "./scenes/screen2.js";

const config = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  autoCenter: Phaser.Scale.CENTER,
  width: 800, //largura da tela do jogo
  height: 600, //altura da tela do jogo
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  parent: "game",
  dom: {
    createContainer: true,
  },
  scene: [screen1, screen2],
  pixelArt: true
};

var game = new Phaser.Game(config);
