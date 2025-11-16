import { Player } from "./player.js";
import { Message } from "./message.js";
import { Game } from "./game.js";

export const activeRooms = new Map<string, Room>();

export enum RoomStatus {
  NOTREADY = "notready",
  READY = "ready",
  IN_PROGRESS = "inprogress",
  COMPLETE = "complete",
}

export class Room {
  name: string;
  status: RoomStatus;
  players: Player[];
  messages: Message[];
  game: Game;

  constructor(name: string, status: RoomStatus, players: Player[], messages: Message[], game: Game) {
    this.name = name;
    this.status = status;
    this.players = players;
    this.messages = messages;
    this.game = game;
  }
}
