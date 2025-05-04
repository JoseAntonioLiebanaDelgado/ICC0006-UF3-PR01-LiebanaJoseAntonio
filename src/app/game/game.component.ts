import { PlayScene } from '../scenes/play.scene'; // Importamos nuestra escena
import { Component, OnInit } from '@angular/core';
// Importamos Phaser
import Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  // Declaramos una variable donde guardaremos el juego
  game!: Phaser.Game;

  constructor() {}

  ngOnInit(): void {
    // Configuración básica del juego
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // Selecciona automáticamente WebGL o Canvas
      width: innerWidth, // Usamos todo el ancho disponible de la ventana
      height: innerHeight, // Usamos toda la altura disponible de la ventana
      backgroundColor: '#1d1d1d', // Color de fondo (oscuro)
      parent: 'game-container', // Este es el div donde dibujará el juego

      // Aquí añadimos la escena que hemos creado (PlayScene)
      scene: [PlayScene],

      // Activamos el motor de físicas Arcade, que usaremos para la nave y colisiones
      physics: {
        default: 'arcade',
      }
    };

    // Creamos una nueva instancia de Phaser con la configuración
    this.game = new Phaser.Game(config);
  }
}
