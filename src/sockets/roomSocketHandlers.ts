import { Socket, Server } from "socket.io";
import { Room, activeRooms } from "../services/room.js";
import { Player } from "../services/player.js";
import { Message } from "../services/message.js";

export const createRoomHandler = async (roomId: string, playerName: string, socket: Socket) => {
  const roomExists = activeRooms.has(roomId);
  if (roomExists) {
    socket.emit("sendSnackbar", "error", "Room already exists");
    return;
  }

  const player = new Player(playerName, false, "admin");
  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  const room = await new Room(roomId, "open", [player], [], []);

  activeRooms.set(roomId, room);
  socket.emit("roomCreated", roomId);
  const players = room.players.map((player) => ({ name: player.name, isReady: player.isReady, role: player.role }));

  socket.emit("playersList", players);

  console.log("createRoomHandler");
};

export const joinRoomHandler = async (roomId: string, playerName: string, socket: Socket, io: Server) => {
  const roomExists = activeRooms.has(roomId);
  if (!roomExists) {
    socket.emit("sendSnackbar", "error", "Room does not exist");
    return;
  }

  const player = new Player(playerName, false, "regular");
  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  const room = activeRooms.get(roomId);

  if (room) {
    room.players.push(player);
    socket.emit("roomJoined", roomId);
    const players = room.players.map((player) => ({ name: player.name, isReady: player.isReady, role: player.role }));
    const messages = room.chat;

    io.to(roomId).emit("playersList", players);
    socket.emit("messageList", messages);
  }

  console.log("joinRoomHandler");
};

export const reJoinRoomHandler = async (roomId: string, playerName: string, socket: Socket, io: Server) => {
  const roomExists = activeRooms.has(roomId);

  if (!roomExists) {
    createRoomHandler(roomId, playerName, socket);
  } else {
    joinRoomHandler(roomId, playerName, socket, io);
  }

  console.log("reJoinRoomHandler");
};

export const getPlayersHandler = async (roomId: string, socket: Socket) => {
  const room = activeRooms.get(roomId);

  if (room) {
    const players = room.players.map((player) => ({ name: player.name, isReady: player.isReady, role: player.role }));
    socket.emit("playersList", players);
  }

  console.log("getPlayersHandler");
};

export const sendSnackbar = async (socket: Socket, severity: string, message: string) => {
  socket.emit("sendSnackbar", severity, message);

  console.log("sendSnackbar");
};

export const newMessageHandler = async (socket: Socket, message: string, io: Server) => {
  const roomId = socket.data.roomId;
  const playerName = socket.data.playerName;

  const newMessage = new Message(playerName, message);
  const room = activeRooms.get(roomId);

  if (room) {
    room.chat.push(newMessage);
    io.to(roomId).emit("messageList", newMessage);
    console.log(roomId, newMessage);
  }

  console.log("chatMessageHandler");
};

export const getMessagesHandler = async (roomId: string, io: Server) => {
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
    const playerIndex = room.players.findIndex((player) => player.name === socket.data.playerName);

    if (playerIndex != -1) {
      room.players.splice(playerIndex, 1);
    }

    const playersInRoom = room.players.length;
    if (playersInRoom === 0) {
      activeRooms.delete(roomId);
    }

    socket.to(roomId).emit("playerLeft", socket.data.playerName);
  }
  console.log("disconnectHandler");
};
