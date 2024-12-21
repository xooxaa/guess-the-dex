import { Injectable, signal } from '@angular/core';
import { Pokemon } from './pokedex.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly STORAGE_KEY = 'caughtPokemons';

  private caughtPokemonsSignal = signal<Pokemon[]>(this.loadPokemon());
  public caughtPokemons = this.caughtPokemonsSignal.asReadonly();

  private loadPokemon(): Pokemon[] {
    const pokemonJson = localStorage.getItem(this.STORAGE_KEY);
    return pokemonJson ? JSON.parse(pokemonJson) : [];
  }

  private savePokemon(pokemon: Pokemon[]) {
    const sortedPokemon = pokemon.sort((a, b) => a.id - b.id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sortedPokemon));
    this.caughtPokemonsSignal.set(sortedPokemon);
  }

  catchPokemon(pokemon: Pokemon): void {
    const caught = this.caughtPokemonsSignal();
    if (!caught.some((p) => p.id === pokemon.id)) {
      caught.push(pokemon);

      this.savePokemon(caught);
    }
  }

  getUncaughtPokemonIds(): number[] {
    const caughtIds = this.caughtPokemonsSignal().map((p) => p.id);
    const allGen1Ids = Array.from({ length: 151 }, (_, i) => i + 1);

    return allGen1Ids.filter((id) => !caughtIds.includes(id));
  }
}
