export class Player {
  name: string;
  isReady: boolean;
  role: string;
  isActive: boolean;

  constructor(name: string, isReady: boolean, role: string, isActive: boolean) {
    this.name = name;
    this.isReady = isReady;
    this.role = role;
    this.isActive = isActive;
  }
}
