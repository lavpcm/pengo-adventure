export default class screen1 extends Phaser.Scene {
  constructor() {
    super("screen1"); // Chama o construtor da superclasse Phaser.Scene com o nome "screen1"
  }

  createButton(x, y, text, callback) {
    // Cria um botão com texto interativo
    let button = this.add
      .text(x, y, text, {
        fontSize: "32px",
        fill: "#ffffff00", // Cor do texto
        padding: { x: 20, y: 10 }, // Espaçamento interno do texto
        fontFamily: "Roboto", // Fonte do texto
      })
      .setOrigin(0.5) // Define a origem do texto para o centro
      .setInteractive(); // Torna o texto interativo

    // Adiciona eventos de interação ao botão
    button.on("pointerover", () => button.setStyle({ fill: "#ffffff00" })); // Evento ao passar o mouse sobre o botão
    button.on("pointerout", () => button.setStyle({ fill: "#ffffff00" })); // Evento ao tirar o mouse do botão
    button.on("pointerdown", callback); // Evento ao clicar no botão
  }

  preload() {
    // Carrega os recursos necessários para a cena
    this.load.image('start-screen', 'assets/start-screen.png'); // Carrega o plano de fundo inicial
    this.load.tilemapTiledJSON("maze", "assets/PenGO-Tileset.json"); // Carrega o mapa do labirinto
    this.load.image('tileset', "assets/Room_Builder_32x32.png"); // Carrega o tileset
  }

  create() {
    // Cria os elementos da cena
    this.add.image(0, 0, 'start-screen').setOrigin(0).setScale(10); // Adiciona o plano de fundo inicial
    this.createButton(400, 550, "START-GAME", () => this.scene.start("screen2")); // Adiciona o botão para começar o jogo, levando para a próxima cena
    this.add.text(140, 70, 'use the keyboard arrow keys to move across the screen'); // Adiciona um texto explicativo
  }
}