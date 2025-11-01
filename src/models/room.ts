import { Player } from "../models/player.js";
import { Message } from "../models/message.js";

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
  game: string[];

  constructor(name: string, status: RoomStatus, players: Player[], messages: Message[], game: string[]) {
    this.name = name;
    this.status = status;
    this.players = players;
    this.messages = messages;
    this.game = game;
  }
}
