import { Socket, Server } from "socket.io";

export const beginGameHandler = async (io: Server, socket: Socket, roomId: string) => {
  console.log("beginGameHandler");
};

export const endGameHandler = async (io: Server, socket: Socket, roomId: string) => {
  console.log("beginGameHandler");
};
