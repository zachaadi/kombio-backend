export class Player {
  name: string;
  isReady: boolean;
  role: string;
  isActive: boolean;
  isTurn: boolean;

  constructor(name: string, isReady: boolean, role: string, isActive: boolean, isTurn: boolean) {
    this.name = name;
    this.isReady = isReady;
    this.role = role;
    this.isActive = isActive;
    this.isTurn = isTurn;
  }
}
