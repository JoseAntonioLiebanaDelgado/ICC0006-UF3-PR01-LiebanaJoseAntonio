import { PlayScene } from '../scenes/play.scene';
import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { StartScene } from '../scenes/start.scene';
import { GameOverScene } from '../scenes/gameover.scene';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game!: Phaser.Game;

  constructor() {}

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: innerWidth,
      height: innerHeight,
      backgroundColor: '#2222aa',
      parent: 'game-container',
      scene: [StartScene, PlayScene, GameOverScene],
      physics: {
        default: 'arcade'
      }
    };

    this.game = new Phaser.Game(config);
  }
}
