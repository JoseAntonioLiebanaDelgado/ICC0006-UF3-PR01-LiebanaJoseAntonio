// Importamos Phaser
import Phaser from 'phaser';

// Creamos una clase que extiende de Phaser.Scene
export class PlayScene extends Phaser.Scene {

    // Variable para guardar la nave (sprite del jugador)
    player!: Phaser.Physics.Arcade.Sprite;

    constructor() {
        // El nombre de la escena será 'PlayScene'
        super('PlayScene');
    }

    // Método preload: aquí se cargarán los recursos (imágenes, sonidos, etc.)
    preload(): void {
        // Cargamos la imagen de la nave
        this.load.image('player', 'assets/sprites/player.png');
    }

    // Método create: se ejecuta una vez al iniciar la escena
    create(): void {
        // Establecemos el color de fondo a negro
        this.cameras.main.setBackgroundColor('#000000');

        // Añadimos la nave al centro de la pantalla
        this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 100, 'player');

        // Escalamos la nave (opcional, si es muy grande puedes ajustar)
        this.player.setScale(0.5); // Puedes ajustar el número según el tamaño
    }

    // Método update: se ejecuta en bucle mientras la escena esté activa
    override update(): void {
        // Por ahora no haremos nada aquí
        let temp = 0;
    }
}
