import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your React app's origin
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname));

app.use("/favicon.ico", express.static("public/favicon.svg"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("createRoom", (roomId, playerName) => {
    const roomExists = io.sockets.adapter.rooms.has(roomId);
    if (roomExists) {
      socket.emit("error", "Room already exists");
      return;
    }

    socket.data.playerName = playerName;
    socket.data.roomId = roomId;

    socket.join(roomId);
    console.log(`User ${playerName} created and joined room: ${roomId}`);
    socket.emit("roomCreated", roomId);
  });

  socket.on("getPlayers", async (roomId) => {
    const sockets = await io.in(roomId).fetchSockets();
    const players = sockets.map((s) => s.data.playerName);
    socket.emit("playersList", players);
  });

  socket.on("joinRoom", (roomId, playerName) => {
    const roomExists = io.sockets.adapter.rooms.has(roomId);
    if (!roomExists) {
      socket.emit("error", "Room does not exist");
      return;
    }

    socket.data.playerName = playerName;
    socket.data.roomId = roomId;

    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    socket.emit("roomJoined", roomId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
