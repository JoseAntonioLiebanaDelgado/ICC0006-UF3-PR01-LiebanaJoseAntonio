import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {

  constructor() {
    super('StartScene'); // Nombre de la escena
  }

  preload(): void {
    // Carga de la imagen de fondo
    this.load.image('spaceBackground', 'assets/sprites/spaceBackground.jpg');
  }

  create(): void {
    // Fondo
    this.add.image(0, 0, 'spaceBackground').setOrigin(0, 0);

    // Título del juego
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 150,
      'Space Defenders',
      {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Crear el input de nombre (HTML)
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Introduce tu nombre';
    input.style.fontSize = '20px';
    input.style.padding = '10px';
    input.style.position = 'absolute';
    input.style.top = `${this.scale.height / 2 - 50}px`;
    input.style.left = `${this.scale.width / 2 - 100}px`;
    input.style.width = '200px';

    document.body.appendChild(input);

    // Botón de iniciar el juego
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
      const playerName = input.value.trim();

      if (!playerName) {
        alert('Por favor, introduce tu nombre antes de jugar.');
        return;
      }

      // Guardar el nombre en localStorage
      localStorage.setItem('playerName', playerName);

      // Eliminar el input de la pantalla
      document.body.removeChild(input);

      // Ir a la escena de juego
      this.scene.start('PlayScene');
    });

    // Efectos hover para el botón
    startText.on('pointerover', () => {
      startText.setStyle({ color: '#ffff00' });
    });

    startText.on('pointerout', () => {
      startText.setStyle({ color: '#00ff00' });
    });

    // --- TEXTO DE CONTROLES ---
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 130,
      'Controles:\nSpace: disparar\nFlechas: mover\nP: Pausa\nR: Reanudar',
      {
        fontSize: '20px',
        color: '#00ff00',
        align: 'center'
      }
    ).setOrigin(0.5);
  }
}
