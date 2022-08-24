import { Server } from "socket.io";
import config from "../config.mjs";

const { port } = config;

const io = new Server(port, { cors: true });

io.on("connection", (socket) => {
  socket.on("connected-successful", (info) => {
    console.log(info);
  });

  // receive a message from the client
  socket.on("client-input-val", (msg) => {
    console.error(msg);

    // send a message to the client
    socket.emit("server-res", msg);
  });
});
