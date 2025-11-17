import { Server } from "socket.io";
import { activeRooms } from "../models/room.js";

export const beginGameHandler = async (io: Server, roomId: string) => {
  const room = activeRooms.get(roomId);
  if (room) {
    const turnIndex = room.game.turnIndex;

    const firstPlayer = room.players[turnIndex];
    if (firstPlayer) {
      firstPlayer.isTurn = true;
      io.to(roomId).emit("beginningGame");
      io.to(roomId).emit("playersList", room.players);
      const firstPlayerSocket = (await io.in(roomId).fetchSockets()).find(
        (socket) => socket.data.playerName === firstPlayer.name
      );
      if (firstPlayerSocket) {
        firstPlayerSocket.emit("yourTurn");
      }
    }
  }

  console.log("beginGameHandler");
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
      const playerSocket = (await io.in(roomId).fetchSockets()).find(
        (socket) => socket.data.playerName === playerTurn.name
      );
      if (playerSocket) {
        playerSocket.emit("yourTurn");
      }
      io.to(roomId).emit("playersList", room.players);
    }
  }

  console.log("nextTurnHandler");
};

export const endGameHandler = async (io: Server, roomId: string) => {
  io.to(roomId).emit("endingGame");

  console.log("beginGameHandler");
};
