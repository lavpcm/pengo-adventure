import { game } from "../main.js";

export default class scene2 extends Phaser.Scene {
    constructor() {
        super("screen2"); // chama o construtor da classe Phaser.Scene com o identificador "screen2"
    }

    // carrega os assets do jogo
    preload() {
        // carrega a spritesheet do pinguim
        this.load.spritesheet('penguin', 'assets/sprite-penguin.png', { frameWidth: 32, frameHeight: 32 });
        // carrega a spritesheet do robô
        this.load.spritesheet('robot', 'assets/sprite-robot.png', { frameWidth: 32, frameHeight: 32 });
        // carrega a imagem do peixe
        this.load.image('fish', 'assets/fish.png');
        // carrega a imagem do peixe 2
        this.load.image('fish2', 'assets/fish2.png');
    }

    create() {
        // adiciona o mapa e o configura
        const maze = this.make.tilemap({ key: "maze" });
        const tileset = maze.addTilesetImage("Room_Builder_32x32", "tileset");
        maze.createLayer("ground", tileset); // cria a camada do chão
        const wallsLayer = maze.createLayer("walls", [tileset]); // cria a camada das paredes
        wallsLayer.setCollisionByProperty({ colide: true }); // define colisão para as paredes

        // definindo cursores
        this.cursors = this.input.keyboard.createCursorKeys();

        // configuração do player
        this.player = this.physics.add.sprite(100, 1950, 'penguin').setScale(2).setBodySize(22, 26); // adicionando o pinguim na tela
        this.cameras.main.startFollow(this.player); // a câmera segue o pinguim
        this.physics.add.collider(this.player, wallsLayer); // faz o pinguim colidir com as paredes do mapa

        // mostra a pontuação do player (quantos peixes ele pegou)
        this.score = 0;
        this.scoreboard = this.add.text(0, 0, 'fish counter: ' + this.score + '/22').setScrollFactor(0); // exibe a pontuação na tela

        // anima o pinguim conforme seu movimento
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('penguin', { start: 1, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('penguin', { start: 4, end: 4 })
        });

        this.anims.create({
            key: 'front',
            frames: this.anims.generateFrameNumbers('penguin', { start: 0, end: 0 })
        });

        // anima os robôs inimigos
        this.anims.create({
            key: 'robotLeft',
            frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        // cria os peixes a serem coletados pelo pinguim
        this.fishes = this.physics.add.staticGroup();
        this.fishPositions = maze.getObjectLayer("Camada de Objetos 1");
        this.fishPositions.objects.forEach((fish) => {
            //verifica tipo de dispositivo
            if (game.device.os.desktop){
                this.fishes.create(fish.x, fish.y, "fish").setScale(0.1).refreshBody(); // adiciona os peixes no mapa
            } else{
                this.fishes.create(fish.x, fish.y, "fish2").setScale(0.1).refreshBody(); // adiciona os peixes no mapa
            }            
        });

        // adiciona colisão entre o pinguim e os peixes
        this.physics.add.overlap(this.player, this.fishes, (penguin, fish) => {
            fish.destroy(); // remove o peixe coletado
            this.score += 1; // incrementa a pontuação
            this.scoreboard.setText('fish counter: ' + this.score + '/22'); // atualiza a pontuação na tela
        });

        // cria os robôs que matam o pinguim
        this.robots = this.physics.add.group();
        this.robotPositions = maze.getObjectLayer("Camada de Objetos 2");
        this.robotPositions.objects.forEach((robot) => {
            this.robots.create(robot.x, robot.y, "robot").refreshBody(); // adiciona os robôs no mapa
        });

        // adiciona colisão entre os robôs e paredes
        this.physics.add.collider(this.robots, wallsLayer);

        // adiciona colisão entre pinguim e robôs
        this.physics.add.overlap(this.player, this.robots, (penguin, robot) => {
            this.scene.start('screen1'); // reinicia o jogo ao colidir com um robô
        });

        // cria as barreiras invisíveis para a movimentação do robô
        this.robotsWall = this.physics.add.staticGroup();
        this.wallPositions = maze.getObjectLayer("robots-collide");
        this.wallPositions.objects.forEach((wall) => {
            this.robotsWall.create(wall.x, wall.y, "wall").setScale(0.7).refreshBody().setVisible(false); // adiciona barreiras invisíveis
        });

        // faz o robô andar de um lado para o outro
        this.robots.children.iterate(child => {
            child.setVelocityX(100); // define a velocidade inicial do robô
            child.anims.play('robotLeft'); // anima o robô
            child.direction = true; // define a direção inicial do robô
        });

        // faz o robô colidir com as paredes invisíveis
        this.physics.add.collider(this.robots, this.robotsWall);
    }

    update() {
        // configura a movimentação do pinguim
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-180); // move o pinguim para a esquerda
            this.player.anims.play('left', true); // anima o pinguim
            this.player.setFlipX(false); // define a direção da animação
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(180); // move o pinguim para a direita
            this.player.anims.play('left', true); // anima o pinguim
            this.player.setFlipX(true); // define a direção da animação
        } else {
            this.player.setVelocityX(0); // para o pinguim
            this.player.anims.play('front', true); // anima o pinguim parado
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-470); // faz o pinguim pular
        }

        if (!this.player.body.onFloor()) {
            this.player.anims.play('jump', true); // anima o pinguim pulando
        }

        // faz os robôs mudarem de direção ao colidirem com as barreiras invisíveis
        this.robots.children.iterate(child => {
            if (!child.body.touching.none) {
                child.direction = !child.direction; // inverte a direção do robô
            }

            if (child.direction) {
                child.setVelocityX(100); // move o robô para a direita
                child.setFlipX(true); // define a direção da animação
            } else {
                child.setFlipX(false); // define a direção da animação
                child.setVelocityX(-100); // move o robô para a esquerda
            }
        });
    }
}