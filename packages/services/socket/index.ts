import { Server } from "socket.io";
import { env } from "../env.js";
import { registerPollSocket } from "./pollSocket.js";
import { registerQuizSocket } from "./quizSocket.js";

const io = new Server({
  cors: {
    origin: [env.CLIENT_URL, env.API_BASE_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

registerPollSocket(io);
registerQuizSocket(io);
const attachSocketServer = (httpServer: any) => {
  io.attach(httpServer);
};

export { io, attachSocketServer };
