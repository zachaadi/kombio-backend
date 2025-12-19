import { Server, Socket } from "socket.io";
import { activeRooms, RoomStatus } from "../models/room.js";

export const beginGameHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    room.status = RoomStatus.IN_PROGRESS;
    const turnIndex = room.game.turnIndex;

    const firstPlayer = room.players[turnIndex];
    room.game.deck.initializeDeck();
    room.game.deck.initializeHands(room.players);

    if (firstPlayer) {
      firstPlayer.isTurn = true;
      io.to(roomId).emit("beginningGame", room.game);
      io.to(roomId).emit("playersList", room.players);
    }
  }

  console.log("beginGameHandler");
};

export const getGameHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    io.to(roomId).emit("setGame", room.game);
  }

  console.log("getGameHandler");
};

export const newActionHandler = async (io: Server, roomId: string, action: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    room.game.actions.push(action);
    io.to(roomId).emit("actionList", room.game.actions);
  }

  console.log("newActionHandler");
};

export const getActionsHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    io.to(roomId).emit("actionList", room.game.actions);
  }

  console.log("getActionsHandler");
};

export const viewCardHandler = async (socket: Socket, roomId: string, name: string, index: number) => {
  const room = activeRooms.get(roomId);
  if (room) {
    const playerHand = room.players.find((p) => p.name == name)?.hand;

    if (playerHand) {
      const card = playerHand[index];
      socket.emit("viewedCard", card);
    }
  }
  console.log("viewCardHandler");
};

export const nextTurnHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);

  if (room) {
    if (room.game.turnIndex == room.players.length - 1) {
      room.game.turnIndex = 0;
    } else {
      room.game.turnIndex += 1;
    }

    const turnIndex = room.game.turnIndex;
    const playerTurn = room.players[turnIndex];

    const lastPlayer = room.players.find((player) => player.isTurn == true);
    if (lastPlayer) {
      lastPlayer.isTurn = false;
    }

    if (playerTurn) {
      playerTurn.isTurn = true;
      io.to(roomId).emit("playersList", room.players);
      io.to(roomId).emit("setGame", room.game);
    }
  }

  console.log("nextTurnHandler");
};

export const endGameHandler = async (io: Server, roomId: string) => {
  io.to(roomId).emit("endingGame");

  console.log("beginGameHandler");
};
