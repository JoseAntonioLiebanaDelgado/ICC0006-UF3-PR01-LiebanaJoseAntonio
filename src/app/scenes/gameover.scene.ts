import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {

  score: number = 0;
  highScore: number = 0;

  constructor() {
    super('GameOverScene');
  }

  init(data: { score: number, highScore: number }) {
    this.score = data.score;
    this.highScore = data.highScore;
  }

  create(): void {
    // Fondo
    this.add.image(0, 0, 'spaceBackground').setOrigin(0, 0);

    // Puntuación
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      `Puntos: ${this.score}`,
      {
        fontSize: '28px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // Récord
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      `Récord: ${this.highScore}`,
      {
        fontSize: '24px',
        color: '#ffff00'
      }
    ).setOrigin(0.5);

    // Botón de reiniciar (texto interactivo)
    const restartText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      'VOLVER A JUGAR',
      {
        fontSize: '28px',
        color: '#00ff00',
        backgroundColor: '#222222',
        padding: { x: 20, y: 10 }
      }
    ).setOrigin(0.5).setInteractive();

    restartText.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });

    restartText.on('pointerover', () => {
      restartText.setStyle({ color: '#ffff00' });
    });

    restartText.on('pointerout', () => {
      restartText.setStyle({ color: '#00ff00' });
    });
  }
}
