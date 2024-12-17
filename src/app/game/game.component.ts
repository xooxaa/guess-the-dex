import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { PokeDexService } from '../services/pokedex.service';

@Component({
  selector: 'app-game',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  readonly pokeDexService = inject(PokeDexService);
  currentPokemon = computed(() => {
    return this.pokeDexService.pokeResource.value();
  });

  guess = new FormControl(0);
  feedback = signal<string>('');
  score = signal<number>(0);

  makeGuess() {
    if (this.guess.value && this.currentPokemon()?.id) {
      const diff = Math.abs(this.guess.value - this.currentPokemon()!.id);

      if (this.guess.value === this.currentPokemon()?.id) {
        this.feedback.set(
          `🎉 Correct! 
          The Pokédex number is ${this.currentPokemon()?.id}.`
        );
      } else {
        this.feedback.set(
          `❌ Incorrect. 
          Your guess is off by ${diff}. 
          The correct number is ${this.currentPokemon()?.id}.`
        );
      }
    }
  }

  newPokemon() {
    this.pokeDexService.fetchRandomPokemon();
    this.feedback.set('');
  }
}
