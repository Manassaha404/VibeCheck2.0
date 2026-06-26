import { Server } from "socket.io";
import { publisher, subscriber } from "../redis/pubsub.js";
import { env } from "../env.js";

//channel;
const SUBMIT_VOTE_CHANNEL_NAME = "redis:poll:submit-vote";
const VIEW_POLL_CHANNEL_NAME = "redis:poll:view";
//server;
const ON_SOCKET_SERVER_SUBMIT_VOTE_EVENT_NAME = "submit:poll";
const ON_SOCKET_SERVER_VIEW_POLL_EVENT_NAME = "view:poll";
//client;
const ON_SOCKET_CLIENT_VOTE_UPDATE_NAME = "update:vote";
const ON_SOCKET_CLIENT_VIEW_UPDATE_NAME = "update:view";



const io = new Server({
  cors: {
    origin: env.CLIENT_URL,
  },
});

export const attachSocketServer = (httpServer: any) => {
  io.attach(httpServer);
};


async function subscribe() {
  await subscriber.subscribe(SUBMIT_VOTE_CHANNEL_NAME, VIEW_POLL_CHANNEL_NAME);
}
subscribe().catch((err) => {
  console.error("Failed to subscribe to Redis channels:", err);
});

subscriber.on("message", (channel, message) => {
  if (channel === SUBMIT_VOTE_CHANNEL_NAME) {
    const { pollId, pollData } = JSON.parse(message);
    io.to(`poll:${pollId}`).emit(ON_SOCKET_CLIENT_VOTE_UPDATE_NAME, {
      pollId,
      pollData,
    });
  }
  if (channel === VIEW_POLL_CHANNEL_NAME) {
    const { pollId } = JSON.parse(message);
    io.to(`poll:${pollId}`).emit(ON_SOCKET_CLIENT_VIEW_UPDATE_NAME);
  }
});

io.on("connection", (socket) => {
  socket.on("join:poll", (pollId) => {
    socket.join(`poll:${pollId}`);
  });
  socket.on("leave:poll", (pollId) => {
    socket.leave(`poll:${pollId}`);
  });
  socket.on(
    ON_SOCKET_SERVER_SUBMIT_VOTE_EVENT_NAME,
    async (pollId, pollData) => {
      await publisher.publish(
        SUBMIT_VOTE_CHANNEL_NAME,
        JSON.stringify({ pollId, pollData }),
      );
    },
  );
  socket.on(ON_SOCKET_SERVER_VIEW_POLL_EVENT_NAME, async (pollId) => {
    await publisher.publish(VIEW_POLL_CHANNEL_NAME, JSON.stringify({ pollId }));
  });
});


