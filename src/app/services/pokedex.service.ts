import { Injectable, resource, signal } from '@angular/core';
import { Pokemon } from './poekedex.types';

@Injectable({
  providedIn: 'root',
})
export class PokeDexService {
  private static readonly BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

  private static readonly GENERATION_RANGES: {
    [key: number]: { min: number; max: number };
  } = {
    1: { min: 1, max: 151 },
    2: { min: 152, max: 251 },
    3: { min: 252, max: 386 },
    4: { min: 387, max: 493 },
    5: { min: 494, max: 649 },
    6: { min: 650, max: 721 },
    7: { min: 722, max: 809 },
    8: { min: 810, max: 905 },
    9: { min: 906, max: 1025 },
  };

  private pokeId = signal<number>(Math.floor(Math.random() * 1025) + 1);

  public pokeResource = resource({
    request: this.pokeId,
    loader: ({ request }) => this.fetchPokemon(request),
  });

  private async fetchPokemon(request: number): Promise<Pokemon> {
    return await fetch(`${PokeDexService.BASE_URL}${request}`)
      .then((res) => res.json())
      .then((data) => this.extractRelevantData(data));
  }

  private extractRelevantData(item: any): Pokemon {
    return {
      id: item.id,
      name: item.name,
      generation: this.determineGeneration(item.id),
      weight: item.weight / 10,
      height: item.height / 10,
      sprite: item.sprites?.other?.home?.front_default || '',
      types: item.types?.map((typeObj: any) => typeObj.type.name) || [],
    };
  }

  private determineGeneration(id: number): number {
    for (const generation in PokeDexService.GENERATION_RANGES) {
      const range = PokeDexService.GENERATION_RANGES[+generation];
      if (id >= range.min && id <= range.max) {
        return +generation;
      }
    }
    return -1;
  }

  public fetchPokemonById(id: number) {
    if (id < 1 && id > 1025) {
      console.error(`Pokedex has no entry for id ${id}`);
      return;
    }
    this.pokeId.set(id);
  }

  public fetchRandomPokemon() {
    const newId = Math.floor(Math.random() * 1025) + 1;
    this.fetchPokemonById(newId);
  }

  public fetchRandomPokemonByGen(generation: number) {
    const range = PokeDexService.GENERATION_RANGES[generation];
    if (!range) {
      console.error(`Generation ${generation} not found.`);
      return;
    }

    const randomId =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    this.fetchPokemonById(randomId);
  }
}
