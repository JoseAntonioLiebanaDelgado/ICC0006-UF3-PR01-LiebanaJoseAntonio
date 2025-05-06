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
  
    // Recuperar el nombre del jugador
    const playerName = localStorage.getItem('playerName') || 'Jugador';
  
    // Guardar la puntuación en localStorage (array de records)
    const recordData = localStorage.getItem('records');
    let records: { name: string, score: number }[] = recordData ? JSON.parse(recordData) : [];
  
    // Añadir la puntuación de esta partida
    records.push({ name: playerName, score: this.score });
  
    // Ordenar de mayor a menor puntuación
    records.sort((a, b) => b.score - a.score);
  
    // Guardar otra vez el array actualizado
    localStorage.setItem('records', JSON.stringify(records));
  
    // Puntuación
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 150,
      `Puntos: ${this.score}`,
      {
        fontSize: '28px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);
  
    // Récord
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      `Récord: ${this.highScore}`,
      {
        fontSize: '24px',
        color: '#ffff00'
      }
    ).setOrigin(0.5);
  
    // Tabla de puntuaciones (máximo 5 mejores)
    const maxRecordsToShow = 5;
    const recordsToShow = records.slice(0, maxRecordsToShow);
  
    let startY = this.scale.height / 2 - 50;
  
    this.add.text(
      this.scale.width / 2,
      startY,
      'Top puntuaciones:',
      { fontSize: '20px', color: '#00ff00' }
    ).setOrigin(0.5);
  
    startY += 30;
  
    recordsToShow.forEach((record, index) => {
      this.add.text(
        this.scale.width / 2,
        startY + index * 25,
        `${index + 1}. ${record.name}: ${record.score}`,
        { fontSize: '18px', color: '#ffffff' }
      ).setOrigin(0.5);
    });
  
    // Botón de reiniciar (texto interactivo)
    const restartText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 150,
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
