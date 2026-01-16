const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://kombio-frontend.onrender.com", "https://kombio-frontend-nonprod.onrender.com"]
    : ["http://localhost:5173"];

console.log("NODE_ENV:", process.env.NODE_ENV);

export const config = {
  port: 3000,
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
};
