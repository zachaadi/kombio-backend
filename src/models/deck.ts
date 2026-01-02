import { Player } from "./player.js";

export class Deck {
  cards: string[];

  constructor() {
    this.cards = [];
  }

  initializeDeck(): void {
    const cardList = [
      "1",
      "1",
      "2",
      "2",
      "3",
      "3",
      "4",
      "4",
      "5",
      "5",
      "6",
      "6",
      "7",
      "7",
      "8",
      "8",
      "9",
      "9",
      "10",
      "10",
      "11",
      "11",
      "12",
      "12",
      "13",
      "13",
      "14",
      "14",
      "0",
      "0",
      "-1",
      "-1",
    ];
    this.cards = [];

    for (const card of cardList) {
      this.cards.push(card);
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i]!, this.cards[j]!] = [this.cards[j]!, this.cards[i]!];
    }
  }

  initializeHands(players: Player[]): void {
    this.shuffle();

    for (const player of players) {
      for (let i = 0; i < 4; i++) {
        const card = this.cards.pop();
        if (card) {
          player.hand.push(card);
        }
      }
    }
  }

  drawCard(player: Player): void {
    const drawnCard = this.cards.pop();
    if (drawnCard) {
      player.hand.push(drawnCard);
    }
  }
}
