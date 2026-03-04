# Kombio Backend

Backend server for Kombio, a real-time multiplayer card game. Built with Express 5, Socket.IO, and MongoDB.

## Environments

| Environment | URL                                               |
| ----------- | ------------------------------------------------- |
| Production  | https://kombio-backend-production.up.railway.app/ |
| Non-prod    | https://kombio-backend-nonprod.up.railway.app/    |

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **Language:** TypeScript
- **Database:** MongoDB
- **Real-time:** Socket.IO
- **Auth:** JWT (httpOnly cookies) + bcrypt password hashing
- **Hosting:** Railway

## Project Structure

```
src/
├── app.ts                  # Entry point — Express + Socket.IO server setup
├── config/
│   ├── database.ts         # MongoDB connection
│   └── socket.ts           # Socket.IO & CORS configuration
├── models/
│   ├── card.ts / deck.ts   # Card deck with shuffle & hand dealing
│   ├── game.ts             # Game state (turns, actions, deck)
│   ├── player.ts           # Player state (name, hand, ready status)
│   ├── room.ts             # Room management (players, chat, game, status)
│   └── chat.ts             # Chat messages
├── routes/
│   ├── expressRouter.ts    # Static file serving & root route
│   └── usersRouter.ts      # Auth routes (create, login, logout)
├── services/
│   └── usersService.ts     # User creation & login with bcrypt
└── sockets/
    ├── roomSocketHandlers.ts / roomSocketsManager.ts   # Room socket events
    └── gameSocketHandlers.ts / gameSocketManager.ts     # Game socket events
```

## API Routes

### Users (`/users`)

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| POST   | `/users/create` | Register a new user             |
| POST   | `/users/login`  | Log in and receive a JWT cookie |
| POST   | `/users/logout` | Clear the auth cookie           |

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)

### Installation

```
git clone https://github.com/zachaadi/kombio-backend.git
cd kombio-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_jwt_secret
ATLAS_URI=your_mongodb_connection_string
```

### Running

```
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

The server starts on port **3000**.
