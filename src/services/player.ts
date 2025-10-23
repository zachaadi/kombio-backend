export class Player {
  name: string;
  isReady: boolean;
  role: string;

  constructor(name: string, isReady: boolean, role: string) {
    this.name = name;
    this.isReady = isReady;
    this.role = role;
  }
}
