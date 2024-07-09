import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.apple;
    this.points = 0;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    this.apple = this.physics.add
      .image(10, sizes.height - 300, "apple")
      .setOrigin(0, 0);
    this.apple.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(
      this.apple,
      this.player,
      this.appleHit,
      null,
      this
    );

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });
  }

  update() {
    if (this.apple.y >= sizes.height) {
      this.apple.setY(0);
      this.apple.setX(this.getRandomX());
    }
    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

  }

  getRandomX() {
    return Math.floor(Math.random() * 400);
  }

  appleHit() {
    this.apple.setY(0);
    this.apple.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`)
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
