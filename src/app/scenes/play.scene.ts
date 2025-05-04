// Importamos Phaser
import Phaser from 'phaser';

// Creamos una clase que extiende de Phaser.Scene
export class PlayScene extends Phaser.Scene {

  // Constructor de la escena
  constructor() {
    // El nombre de la escena será 'PlayScene'
    super('PlayScene');
  }

  // Método preload: aquí se cargarán los recursos si tuviéramos (imágenes, sonidos, etc.)
  preload(): void {
    // De momento no cargamos nada
  }

  // Método create: se ejecuta una vez al iniciar la escena
  create(): void {
    // Establecemos el color de fondo a negro
    this.cameras.main.setBackgroundColor('#000000');
  }

  // Método update: se ejecuta en bucle mientras la escena esté activa
  override update(): void {
    // De momento no haremos nada aquí
    let temp = 0; // Esto evita el error de método vacío
  }
}