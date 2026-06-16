import http from "node:http";
import { app as expressApplication } from "./server";
import "dotenv/config";
import { env } from "./env";
import "@repo/services/email/emailWorker";

async function init() {
  try {
    const server = http.createServer(expressApplication);
    const PORT: number = env.PORT ? +env.PORT : 8000;
    server.listen(PORT, () => {
      console.log(`http server is running on PORT ${PORT}`)
    });
  } catch (err) {
    console.error(`Error creating http server`, { err });
    process.exit(1);
  }
}

init();