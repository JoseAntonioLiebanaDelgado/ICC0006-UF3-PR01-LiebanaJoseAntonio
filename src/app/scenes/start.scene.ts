import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {

  constructor() {
    super('StartScene');
  }

  create(): void {
    // Texto de título
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Mi Juego Espacial', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Botón de comenzar (texto interactivo)
    const startText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'JUGAR', {
      fontSize: '28px',
      color: '#00ff00'
    }).setOrigin(0.5).setInteractive();

    startText.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });
  }
}
