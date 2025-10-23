import { Player } from "../services/player.js";

export const activeRooms = new Map<string, Room>();

export class Room {
  name: string;
  status: string;
  players: Player[];
  game: string[];

  constructor(name: string, status: string, players: Player[], game: string[]) {
    this.name = name;
    this.status = status;
    this.players = players;
    this.game = game;
  }
}
