import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {

  constructor() {
    super('StartScene');
  }

  preload(): void {
    this.load.image('spaceBackground', 'assets/sprites/spaceBackground.jpg');
  }

  create(): void {
    // Fondo
    this.add.image(0, 0, 'spaceBackground').setOrigin(0, 0);

    // Título
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      'Mi Juego Espacial',
      {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Botón de iniciar (texto interactivo)
    const startText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      'JUGAR',
      {
        fontSize: '28px',
        color: '#00ff00',
        backgroundColor: '#222222',
        padding: { x: 20, y: 10 }
      }
    ).setOrigin(0.5).setInteractive();

    // Click => empieza el juego
    startText.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });

    // Efecto al pasar el ratón
    startText.on('pointerover', () => {
      startText.setStyle({ color: '#ffff00' });
    });

    startText.on('pointerout', () => {
      startText.setStyle({ color: '#00ff00' });
    });
  }
}
