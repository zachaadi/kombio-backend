import { Player } from "../services/player.js";
import { Message } from "../services/message.js";

export const activeRooms = new Map<string, Room>();

export class Room {
  name: string;
  status: string;
  players: Player[];
  chat: Message[];
  game: string[];

  constructor(name: string, status: string, players: Player[], chat: Message[], game: string[]) {
    this.name = name;
    this.status = status;
    this.players = players;
    this.chat = chat;
    this.game = game;
  }
}
