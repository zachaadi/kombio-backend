export class Player {
  name: string;
  isReady: boolean;
  role: string;
  isActive: boolean;
  isTurn: boolean;
  hand: string[];

  constructor(name: string, isReady: boolean, role: string, isActive: boolean, isTurn: boolean, hand: string[]) {
    this.name = name;
    this.isReady = isReady;
    this.role = role;
    this.isActive = isActive;
    this.isTurn = isTurn;
    this.hand = hand;
  }
}
