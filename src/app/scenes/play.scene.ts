// Importamos Phaser
import Phaser from 'phaser';

// Creamos una clase que extiende de Phaser.Scene
export class PlayScene extends Phaser.Scene {

  // Sprite del jugador (la nave)
  player!: Phaser.Physics.Arcade.Sprite;

  // Controles del teclado (flechas)
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // Tecla para disparar (espacio)
  spaceKey!: Phaser.Input.Keyboard.Key;

  // Grupo de balas
  bullets!: Phaser.Physics.Arcade.Group;

  // Grupo de asteroides
  asteroids!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('PlayScene');
  }

  preload(): void {
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.image('asteroid', 'assets/sprites/asteroid.png');
  }

  create(): void {
    // Crear la nave
    this.player = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height - 100,
      'player'
    );
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);

    // Controles
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Limpiar conflictos teclado
    this.input.keyboard!.removeAllListeners();
    this.input.keyboard!.enabled = true;

    // Grupo de balas
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 10
    });

    // Grupo de asteroides
    this.asteroids = this.physics.add.group({
      defaultKey: 'asteroid',
      maxSize: 20
    });

    // Crear asteroides cada 2 segundos
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnAsteroid,
      callbackScope: this,
      loop: true
    });

    // COLISIÓN BALAS VS ASTEROIDES
    this.physics.add.overlap(
      this.bullets,
      this.asteroids,
      this.bulletHitsAsteroid as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  override update(): void {
    // MOVIMIENTO DE LA NAVE
    if (this.cursors.left!.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right!.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    // DISPARO
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey!)) {
      this.shootBullet();
    }

    // Limpiar balas fuera de pantalla
    this.bullets.children.each((b) => {
      const bullet = b as Phaser.Physics.Arcade.Image;
      if (bullet.active && bullet.y < -10) {
        bullet.setActive(false);
        bullet.setVisible(false);
      }
      return null;
    });
  }

  // DISPARAR BALAS
  shootBullet(): void {
    const bullet = this.bullets.get(this.player.x, this.player.y - 20) as Phaser.Physics.Arcade.Image;

    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body && (bullet.body.velocity.y = -400);
      bullet.setScale(0.1);
    }
  }

  // CREAR ASTEROIDES
  spawnAsteroid(): void {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const asteroid = this.asteroids.get(x, -50) as Phaser.Physics.Arcade.Image;

    if (asteroid) {
      asteroid.setActive(true);
      asteroid.setVisible(true);
      asteroid.setVelocityY(100);
      asteroid.setScale(0.2);
    }
  }

  // CUANDO UNA BALA IMPACTA UN ASTEROIDE
  bulletHitsAsteroid(
    bulletObj: Phaser.GameObjects.GameObject,
    asteroidObj: Phaser.GameObjects.GameObject
  ): void {
    const bullet = bulletObj as Phaser.Physics.Arcade.Image;
    const asteroid = asteroidObj as Phaser.Physics.Arcade.Image;

    bullet.setActive(false);
    bullet.setVisible(false);

    asteroid.setActive(false);
    asteroid.setVisible(false);

    console.log('¡Asteroide destruido!');
  }
}
