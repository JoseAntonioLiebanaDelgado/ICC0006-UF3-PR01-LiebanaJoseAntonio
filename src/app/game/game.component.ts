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
      width: innerWidth, // Usamos todo el ancho disponible
      height: innerHeight, // Usamos toda la altura disponible
      backgroundColor: '#1d1d1d', // Color de fondo (oscuro, puedes cambiarlo)
      parent: 'game-container', // Este es el div donde dibujará el juego
      scene: [] // De momento, ninguna escena. Luego añadiremos aquí nuestras escenas
    };

    // Creamos una nueva instancia de Phaser con la configuración
    this.game = new Phaser.Game(config);
  }
}
