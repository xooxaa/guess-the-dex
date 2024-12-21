import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { PokeDexService } from '../services/pokedex.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  readonly pokeDexService = inject(PokeDexService);
  readonly gameService = inject(GameService);

  currentPokemon = computed(() => {
    return this.pokeDexService.pokeResource.value();
  });

  constructor() {
    this.newPokemon();
  }

  options = signal<number[]>([]);
  feedback = signal<string>('');
  score = computed(() => {
    return this.gameService.caughtPokemons().length;
  });

  makeGuess(selectedId: number) {
    const current = this.currentPokemon();
    if (!current) {
      this.feedback.set('⚠️ Please wait for the Pokémon to load!');
      return;
    }

    if (selectedId === current.id) {
      this.feedback.set(`🎉 Catch! New Pokedex entry ${current.id}.`);
      this.gameService.catchPokemon(current);
    } else {
      this.feedback.set(`❌ Miss. Try again!`);
    }
  }

  newPokemon() {
    const uncaughtIds = this.gameService.getUncaughtPokemonIds();

    if (uncaughtIds.length === 0) {
      this.feedback.set(
        '🎉🎉 Congratulations! You have caught all Pokémon! 🎉🎉'
      );
      return;
    }

    const randomIndex = Math.floor(Math.random() * uncaughtIds.length);
    const randomId = uncaughtIds[randomIndex];
    this.pokeDexService.fetchPokemonById(randomId);

    this.generateOptions(randomId, uncaughtIds);
    this.feedback.set('');
  }

  private generateOptions(correctId: number, uncaughtIds: number[]) {
    const options = new Set<number>();
    options.add(correctId);

    if (uncaughtIds.length > 3) {
      while (options.size < 4) {
        const randomIndex = Math.floor(Math.random() * uncaughtIds.length);
        options.add(uncaughtIds[randomIndex]);
      }
    } else {
      uncaughtIds.forEach((id) => options.add(id));
    }

    this.options.set([...options].sort(() => Math.random() - 0.5));
  }
}
