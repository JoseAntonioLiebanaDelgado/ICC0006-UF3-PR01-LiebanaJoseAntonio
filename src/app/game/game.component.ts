import { PlayScene } from '../scenes/play.scene';
import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { StartScene } from '../scenes/start.scene';
import { GameOverScene } from '../scenes/gameover.scene';

@Component({
  selector: 'app-game', // Selector del componente
  templateUrl: './game.component.html', // HTML asociado
  styleUrls: ['./game.component.scss'] // Estilos asociados
})
export class GameComponent implements OnInit {

  game!: Phaser.Game; // Variable para la instancia del juego

  constructor() {}

  ngOnInit(): void {
    // Configuración del juego Phaser
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // Usa WebGL o Canvas automáticamente
      width: innerWidth,
      height: innerHeight,
      backgroundColor: '#2222aa',
      parent: 'game-container', // ID del div donde se mostrará el juego
      scene: [StartScene, PlayScene, GameOverScene], // Escenas del juego
      physics: {
        default: 'arcade' // Usa físicas tipo arcade
      }
    };

    this.game = new Phaser.Game(config); // Crear instancia del juego
  }
}
