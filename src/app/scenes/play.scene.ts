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

  constructor() {
    super('PlayScene'); // Nombre de la escena
  }

  preload(): void {
    // Cargamos las imágenes
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('bullet', 'assets/sprites/bullet.png');
  }

  create(): void {
    // -------------------------------------
    // CREACIÓN DE LA NAVE
    // -------------------------------------
    this.player = this.physics.add.sprite(
      this.scale.width / 2,          // Centrada horizontalmente
      this.scale.height - 100,       // Cerca de la parte inferior
      'player'
    );

    this.player.setScale(0.5);               // Escalamos la nave
    this.player.setCollideWorldBounds(true); // No puede salir de pantalla

    // -------------------------------------
    // CAPTURAR TECLAS
    // -------------------------------------
    this.cursors = this.input.keyboard!.createCursorKeys();  // Flechas
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Espacio

    // Limpieza de posibles conflictos de teclado
    this.input.keyboard!.removeAllListeners();
    this.input.keyboard!.enabled = true;

    // -------------------------------------
    // CREACIÓN DE BALAS
    // -------------------------------------
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 10 // Máximo de 10 balas activas
    });
  }

  override update(): void {
    // -------------------------------------
    // MOVIMIENTO DE LA NAVE
    // -------------------------------------
    if (this.cursors.left!.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right!.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    // -------------------------------------
    // DISPARO
    // -------------------------------------
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey!)) {
      console.log('¡Barra espaciadora pulsada!');
      this.shootBullet();
    }

    // -------------------------------------
    // LIMPIAR BALAS FUERA DE PANTALLA
    // -------------------------------------
    this.bullets.children.each((b) => {
      const bullet = b as Phaser.Physics.Arcade.Image;
      if (bullet.active && bullet.y < -10) {
        bullet.setActive(false);
        bullet.setVisible(false);
      }
      return null; // 👈 ESTE RETURN es lo que arregla el error
    });
  }

  // -------------------------------------
  // MÉTODO PARA DISPARAR BALAS
  // -------------------------------------
  shootBullet(): void {
    const bullet = this.bullets.get(
      this.player.x,
      this.player.y - 20
    ) as Phaser.Physics.Arcade.Image;

    if (bullet) {
      console.log('Bala creada en:', bullet.x, bullet.y);

      bullet.setActive(true);
      bullet.setVisible(true);

      bullet.body && (bullet.body.velocity.y = -400); // Movimiento hacia arriba
      bullet.setScale(0.1); // Tamaño reducido
    } else {
      console.log('No se pudo crear la bala');
    }
  }
}
