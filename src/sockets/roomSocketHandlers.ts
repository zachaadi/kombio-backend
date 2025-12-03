import { Socket, Server } from "socket.io";
import { Room, activeRooms, RoomStatus } from "../models/room.js";
import { Player } from "../models/player.js";
import { Chat } from "../models/chat.js";
import { Game } from "../models/game.js";
import { Deck } from "../models/deck.js";

const roomDeletionTimers = new Map<string, NodeJS.Timeout>();
const adminReplacementTimers = new Map<string, NodeJS.Timeout>();

export const createRoomHandler = async (socket: Socket, roomId: string, playerName: string) => {
  const roomExists = activeRooms.has(roomId);
  if (roomExists) {
    socket.emit("sendSnackbar", "error", "Room already exists");
    return;
  }

  const player = new Player(playerName, false, "admin", true, false, []);

  socket.data.playerName = playerName;
  socket.data.roomId = roomId;
  await socket.join(roomId);

  const deck = new Deck();
  const game = new Game(0, [], deck);
  const room = await new Room(roomId, RoomStatus.NOTREADY, [player], [], game);
  activeRooms.set(roomId, room);

  socket.emit("roomCreated", roomId);
  socket.emit("playersList", room.players);

  console.log("createRoomHandler");
};

export const joinRoomHandler = async (io: Server, socket: Socket, roomId: string, playerName: string) => {
  const roomExists = activeRooms.has(roomId);
  if (!roomExists) {
    socket.emit("sendSnackbar", "error", "Room does not exist");
    return;
  }

  const room = activeRooms.get(roomId);
  if (room) {
    if (room.status == RoomStatus.IN_PROGRESS) {
      socket.emit("sendSnackbar", "error", "Game is already in progress");
      return;
    }

    const player = new Player(playerName, false, "regular", true, false, []);
    socket.data.playerName = playerName;
    socket.data.roomId = roomId;

    await socket.join(roomId);
    room.players.push(player);

    socket.emit("roomJoined", roomId);
    io.to(roomId).emit("playersList", room.players);
    io.to(roomId).emit("notReady", room);
    socket.emit("chatList", room.chat);
  }

  console.log("joinRoomHandler");
};

export const reJoinRoomHandler = async (io: Server, socket: Socket, roomId: string, playerName: string) => {
  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  const room = activeRooms.get(roomId);

  if (room) {
    const player = room.players.find((player) => player.name === playerName);
    if (player) {
      player.isActive = true;

      const deleteTimer = roomDeletionTimers.get(roomId);
      if (deleteTimer) {
        clearTimeout(deleteTimer);
        roomDeletionTimers.delete(roomId);
      }

      const adminTimer = adminReplacementTimers.get(roomId);
      if (adminTimer) {
        clearTimeout(adminTimer);
        adminReplacementTimers.delete(roomId);
      }
    }

    io.to(roomId).emit("playersList", room.players);
    io.to(roomId).emit("chatList", room.chat);
    io.to(roomId).emit("setGame", room.game);
    io.to(roomId).emit("actionList", room.game.actions);
    io.to(roomId).emit("roomStatus", room.status);
    //send a snackbar that player rejoined???
  }

  console.log("reJoinRoomHandler");
};

export const joinFromUrlHandler = async (io: Server, socket: Socket, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    if (room.status == RoomStatus.IN_PROGRESS) {
      socket.emit("kickPlayer");
      socket.emit("sendSnackbar", "error", "Game is already in progress");
      return;
    }

    const playerCount = room.players.length;
    const assignedName = `guest${playerCount}`;
    const player = new Player(assignedName, false, "regular", true, false, []);
    socket.data.playerName = assignedName;
    socket.data.roomId = roomId;

    await socket.join(roomId);
    room.players.push(player);

    socket.emit("playerFromUrl", roomId, assignedName);
    io.to(roomId).emit("playersList", room.players);
    io.to(roomId).emit("notReady", room);
    socket.emit("chatList", room.chat);
  } else {
    createRoomHandler(socket, roomId, "guest");
    socket.emit("playerFromUrl", roomId, "guest");
  }

  console.log("joinFromUrlHandler");
};

export const getPlayersHandler = async (socket: Socket, roomId: string) => {
  const room = activeRooms.get(roomId);

  if (room) {
    socket.emit("playersList", room.players);
  }

  console.log("getPlayersHandler");
};

export const sendSnackbarHandler = async (socket: Socket, severity: string, message: string) => {
  socket.emit("sendSnackbar", severity, message);

  console.log("sendSnackbarHandler");
};

export const newChatHandler = async (io: Server, roomId: string, playerName: string, message: string) => {
  const newChat = new Chat(playerName, message);
  const room = activeRooms.get(roomId);

  if (room) {
    room.chat.push(newChat);
    io.to(roomId).emit("chatList", room.chat);
  }

  console.log("newChatHandler");
};

export const getChatHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    io.to(roomId).emit("chatList", room.chat);
  }

  console.log("getChatHandler");
};

export const editNameHandler = async (
  io: Server,
  socket: Socket,
  roomId: string,
  playerName: string,
  newName: string
) => {
  socket.data.playerName = newName;
  socket.data.roomId = roomId;

  const room = activeRooms.get(roomId);

  if (room) {
    const player = room.players.find((player) => player.name === playerName);
    if (player) {
      room.chat.forEach((chat) => {
        if (chat.name == playerName) {
          chat.name = newName;
        }
      });

      player.name = newName;
    }

    io.to(roomId).emit("chatList", room.chat);
    io.to(roomId).emit("playersList", room.players);
  }

  console.log("editNameHandler");
};

export const getRoomStatusHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    io.to(roomId).emit("roomStatus", room.status);
  }

  console.log("getRoomStatusHandler");
};

export const readyUpHandler = async (io: Server, roomId: string, playerName: string) => {
  const room = activeRooms.get(roomId);

  if (room) {
    const player = room.players.find((player) => player.name == playerName);
    if (player) {
      player.isReady = !player.isReady;
      const players = room.players;
      io.to(roomId).emit("playersList", players);
    }

    const allReady = room.players.filter((player) => player.isActive).every((player) => player.isReady);
    const minActivePlayers = room.players.filter((player) => player.isActive && player.isReady).length > 1;

    if (allReady && minActivePlayers) {
      room.status = RoomStatus.READY;
      io.to(roomId).emit("allReady");
    } else {
      room.status = RoomStatus.NOTREADY;
      io.to(roomId).emit("notReady");
    }
  }
  console.log("readyUpHandler");
};

export const removePlayerHandler = async (io: Server, roomId: string, playerName: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    const playerIndex = room.players.findIndex((player) => player.name == playerName);
    if (playerIndex != -1) {
      const removedSocket = (await io.in(roomId).fetchSockets()).find((socket) => socket.data.playerName == playerName);
      if (removedSocket) {
        removedSocket.emit("sendSnackbar", "error", "You have been removed from room");
        removedSocket.emit("kickPlayer");
        removedSocket.leave(roomId);
      }
      room.players.splice(playerIndex, 1);
      io.to(roomId).emit("sendSnackbar", "info", `${playerName} removed from lobby`);
    }
    io.to(roomId).emit("playersList", room.players);
    const minActivePlayers = room.players.filter((player) => player.isActive && player.isReady).length > 1;

    if (!minActivePlayers) {
      io.to(roomId).emit("notReady", room);
    }
  }

  console.log("removePlayerHandler");
};

export const disconnectHandler = async (io: Server, socket: Socket) => {
  const roomId = socket.data.roomId;

  const room = activeRooms.get(roomId);
  if (room) {
    const player = room.players.find((player) => player.name === socket.data.playerName);

    if (player) {
      player.isActive = false;

      if (player.role == "admin") {
        const timer = setTimeout(async () => {
          const newAdmin = room.players.find((player) => player.name != socket.data.playerName && player.isActive);
          if (newAdmin) {
            newAdmin.role = "admin";
            const newAdminSocket = (await io.in(roomId).fetchSockets()).find(
              (socket) => socket.data.playerName == newAdmin.name
            );
            if (newAdminSocket) {
              newAdminSocket.emit("sendSnackbar", "info", "You have been made Admin");
            }
          }

          io.to(roomId).emit("playersList", room.players);
        }, 3000);
        adminReplacementTimers.set(roomId, timer);
      }
    }

    const activePlayersCount = room.players.filter((player) => player.isActive).length;

    if (activePlayersCount === 0) {
      const deleteTimer = setTimeout(() => {
        activeRooms.delete(roomId);
      }, 3000);
      roomDeletionTimers.set(roomId, deleteTimer);
    }

    socket.to(roomId).emit("playerLeft", socket.data.playerName);
  }

  console.log("disconnectHandler");
};
