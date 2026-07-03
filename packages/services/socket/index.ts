import { Server } from "socket.io";
import { env } from "../env.js";
const io = new Server({
  cors: {
    origin: env.CLIENT_URL,
  },
});

const attachSocketServer = (httpServer: any) => {
  io.attach(httpServer);
};

export { io, attachSocketServer };
