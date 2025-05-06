import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {

  score: number = 0; // Puntuación de esta partida
  highScore: number = 0; // Récord guardado

  constructor() {
    super('GameOverScene'); // Nombre de la escena
  }

  init(data: { score: number, highScore: number }) {
    this.score = data.score; // Puntos obtenidos
    this.highScore = data.highScore; // Mejor puntuación hasta ahora
  }

  create(): void {

    // --- Fondo ---
    this.add.image(0, 0, 'spaceBackground').setOrigin(0, 0);

    // --- Recuperar el nombre del jugador ---
    const playerName = localStorage.getItem('playerName') || 'Jugador';

    // --- Recuperar records anteriores ---
    const recordData = localStorage.getItem('records');
    let records: { name: string, score: number }[] = recordData ? JSON.parse(recordData) : [];

    // --- Añadir la puntuación de esta partida ---
    records.push({ name: playerName, score: this.score });

    // --- Ordenar de mayor a menor ---
    records.sort((a, b) => b.score - a.score);

    // --- Guardar los records actualizados ---
    localStorage.setItem('records', JSON.stringify(records));

    // --- Mostrar puntuación actual ---
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 150,
      `Puntos: ${this.score}`,
      {
        fontSize: '28px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    // --- Mostrar récord ---
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      `Récord: ${this.highScore}`,
      {
        fontSize: '24px',
        color: '#ffff00'
      }
    ).setOrigin(0.5);

    // --- Mostrar tabla de puntuaciones ---
    const maxRecordsToShow = 5; // Máximo 5 puntuaciones
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

    // --- Botón de reiniciar ---
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

    // --- Efectos hover para el botón ---
    restartText.on('pointerover', () => {
      restartText.setStyle({ color: '#ffff00' });
    });

    restartText.on('pointerout', () => {
      restartText.setStyle({ color: '#00ff00' });
    });
  }
}
