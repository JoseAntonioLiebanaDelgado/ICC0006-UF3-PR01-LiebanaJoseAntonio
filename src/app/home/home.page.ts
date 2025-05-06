import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-home', // Selector del componente
  standalone: true, // Indica que es un componente autónomo
  imports: [IonicModule, GameComponent], // Importa Ionic y el componente del juego
  templateUrl: './home.page.html', // HTML asociado
  styleUrls: ['./home.page.scss'], // Estilos asociados
})
export class HomePage {
  // Página principal que carga el componente del juego
}
