import { Server } from "socket.io";

const args = process.argv.splice(2);
const port = parseInt(args[0]) ?? 3101;

const io = new Server(port, { cors: true });
const sessionList = [];

io.on("connection", (socket) => {
  console.log("socket connected successful");

  //服务端监听用户进入聊天室
  socket.on("add user", ({ id }) => {
    socket.id = id;
    if (!sessionList.includes(id)) {
      sessionList.push(id);
    }

    console.log(`${id} 已加入房间, 房间人数: ${sessionList.length}`);
    console.log(JSON.stringify(sessionList));

    //服务端广播用户加入聊天室信息
    io.emit("user joined", { id, userList: sessionList });
  });

  //服务端监听客户端发送的新消息
  socket.on("new message", ({ id, message }) => {
    io.emit("new message", { id, message });
  });

  socket.on("disconnect", () => {
    sessionList.splice(sessionList.indexOf(socket.id), 1);
    socket.broadcast.emit("user leave", {
      id: socket.id,
      userList: sessionList,
    });
  });
});
