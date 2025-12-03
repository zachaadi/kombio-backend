import { Deck } from "./deck.js";

export class Game {
  turnIndex: number;
  actions: string[];
  deck: Deck;

  constructor(turnIndex: number, actions: string[], deck: Deck) {
    this.turnIndex = turnIndex;
    this.actions = actions;
    this.deck = deck;
  }
}
