import {Card} from "./deck.js"

export class Player {
  name: string;
  isReady: boolean;
  role: string;
  isActive: boolean;
  isTurn: boolean;
  hand: Card[];

  constructor(name: string, isReady: boolean, role: string, isActive: boolean, isTurn: boolean, hand: Card[]) {
    this.name = name;
    this.isReady = isReady;
    this.role = role;
    this.isActive = isActive;
    this.isTurn = isTurn;
    this.hand = hand;
  }
}
