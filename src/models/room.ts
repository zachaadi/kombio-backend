import { Player } from "./player.js";
import { Chat } from "./chat.js";
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
  chat: Chat[];
  game: Game;

  constructor(name: string, status: RoomStatus, players: Player[], chat: Chat[], game: Game) {
    this.name = name;
    this.status = status;
    this.players = players;
    this.chat = chat;
    this.game = game;
  }
}
