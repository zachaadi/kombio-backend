const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://kombio-frontend.onrender.com", "https://kombio-frontend-nonprod.onrender.com"]
    : ["http://localhost:5173"];

export const config = {
  port: 3000,
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
};
