export class Game {
  turnIndex: number;
  actions: string[];

  constructor(turnIndex: number, actions: string[]) {
    this.turnIndex = turnIndex;
    this.actions = actions;
  }
}
