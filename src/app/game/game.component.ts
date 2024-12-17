import { Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { PokeDexService } from '../services/pokedex.service';

@Component({
  selector: 'app-game',
  imports: [UpperCasePipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly pokeDexService = inject(PokeDexService);
  currentPokemon = computed(() => {
    return this.pokeDexService.pokeResource.value();
  });
}
