import React, { memo, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";

const host = "localhost",
  port = 3101;

const SocketDemo = () => {
  const [socket, setSocket] = useState(io());
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    initSocket();
  }, []);

  const initSocket = () => {
    const socket = io(`ws://${host}:${port}`);
    setSocket(socket);
    socket.emit("connected-successful", {
      id: nanoid(),
      ts: Date.now(),
    });

    socket.on("server-res", (msg) => {
      console.log("server-res", msg);
    });
  };

  const handleSend = () => {
    socket.emit("client-input-val", inputVal);
  };

  return (
    <div>
      <h3>Socket Demo</h3>

      <input
        style={{ width: "500px" }}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />

      <div>
        <button onClick={handleSend}>send</button>
      </div>
    </div>
  );
};

export default memo(SocketDemo);
