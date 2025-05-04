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
    // Mostrar puntuación
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, `Puntos: ${this.score}`, {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Mostrar récord
    this.add.text(this.scale.width / 2, this.scale.height / 2, `Récord: ${this.highScore}`, {
      fontSize: '24px',
      color: '#ffff00'
    }).setOrigin(0.5);

    // Botón de reiniciar
    const restartText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 'VOLVER A JUGAR', {
      fontSize: '28px',
      color: '#00ff00'
    }).setOrigin(0.5).setInteractive();

    restartText.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });
  }
}
