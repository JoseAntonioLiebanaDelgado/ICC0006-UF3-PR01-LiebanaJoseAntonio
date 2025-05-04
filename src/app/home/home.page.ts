import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, GameComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {}
