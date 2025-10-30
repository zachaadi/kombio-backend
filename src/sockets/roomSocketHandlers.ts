import { Socket, Server } from "socket.io";
import { Room, activeRooms } from "../models/room.js";
import { Player } from "../models/player.js";
import { Message } from "../models/message.js";

const roomDeletionTimers = new Map<string, NodeJS.Timeout>();

export const createRoomHandler = async (socket: Socket, roomId: string, playerName: string) => {
  const roomExists = activeRooms.has(roomId);
  if (roomExists) {
    socket.emit("sendSnackbar", "error", "Room already exists");
    return;
  }

  const player = new Player(playerName, false, "admin", true);
  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  const room = await new Room(roomId, "open", [player], [], []);

  activeRooms.set(roomId, room);
  socket.emit("roomCreated", roomId);
  const players = room.players;

  socket.emit("playersList", players);

  console.log("createRoomHandler");
};

export const joinRoomHandler = async (io: Server, socket: Socket, roomId: string, playerName: string) => {
  const roomExists = activeRooms.has(roomId);
  if (!roomExists) {
    socket.emit("sendSnackbar", "error", "Room does not exist");
    return;
  }

  const player = new Player(playerName, false, "regular", true);
  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  const room = activeRooms.get(roomId);

  if (room) {
    room.players.push(player);
    socket.emit("roomJoined", roomId);
    const players = room.players;
    const messages = room.chat;

    io.to(roomId).emit("playersList", players);
    socket.emit("messageList", messages);
    const timer = roomDeletionTimers.get(roomId);
    if (timer) {
      clearTimeout(timer);
      roomDeletionTimers.delete(roomId);
    }
  }

  console.log("joinRoomHandler");
};

export const reJoinRoomHandler = async (io: Server, socket: Socket, roomId: string, playerName: string) => {
  const room = activeRooms.get(roomId);
  await socket.join(roomId);
  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  if (room) {
    const player = room.players.find((player) => player.name === playerName);
    if (player) {
      player.isActive = true;
      const timer = roomDeletionTimers.get(roomId);
      if (timer) {
        clearTimeout(timer);
        roomDeletionTimers.delete(roomId);
      }
    }
    const players = room.players;
    const messages = room.chat;
    io.to(roomId).emit("playersList", players);
    io.to(roomId).emit("messageList", messages);
  }

  console.log("reJoinRoomHandler");
};

export const getPlayersHandler = async (socket: Socket, roomId: string) => {
  const room = activeRooms.get(roomId);

  if (room) {
    const players = room.players;
    socket.emit("playersList", players);
  }

  console.log("getPlayersHandler");
};

export const sendSnackbarHandler = async (socket: Socket, severity: string, message: string) => {
  socket.emit("sendSnackbar", severity, message);

  console.log("sendSnackbarHandler");
};

export const newMessageHandler = async (io: Server, roomId: string, playerName: string, message: string) => {
  const newMessage = new Message(playerName, message);
  const room = activeRooms.get(roomId);

  if (room) {
    room.chat.push(newMessage);
    io.to(roomId).emit("messageList", newMessage);
  }

  console.log("newMessageHandler");
};

export const getMessagesHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    const messageList = room.chat;
    io.to(roomId).emit("messageList", messageList);
  }

  console.log("getMessagesHandler");
};

export const disconnectHandler = (socket: Socket) => {
  const roomId = socket.data.roomId;

  const room = activeRooms.get(roomId);
  if (room) {
    const player = room.players.find((player) => player.name === socket.data.playerName);
    if (player) {
      player.isActive = false;
    }

    const activePlayersCount = room.players.filter((player) => player.isActive).length;

    if (activePlayersCount === 0) {
      const timer = setTimeout(() => {
        activeRooms.delete(roomId);
      }, 3000);
      roomDeletionTimers.set(roomId, timer);
    }

    socket.to(roomId).emit("playerLeft", socket.data.playerName);
  }
  
  console.log("disconnectHandler");
};
