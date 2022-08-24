import React, { memo, useEffect, useState, useRef } from "react";
import useUrlState from "@ahooksjs/use-url-state";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";

import "./index.css";

const ChatRoom = () => {
  const [socket, setSocket] = useState(io());
  const [message, setMessage] = useState("");
  const [content, setContent] = useState<
    {
      id: string;
      message: string;
      type?: string;
    }[]
  >([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [query, setQuery] = useUrlState({ port: 3101, host: "localhost" });

  const userInfo = useRef({ id: "", enterRoomTS: 0 });
  const roomState = useRef({
    content: [] as {
      id: string;
      message: string;
      type?: string;
    }[],
  });

  useEffect(() => {
    initSocket();

    userInfo.current = {
      id: nanoid(),
      enterRoomTS: Date.now(),
    };
  }, []);

  useEffect(() => {
    roomState.current.content = content;
  }, [content]);

  const initSocket = () => {
    const { host, port } = query;
    console.error(host, port);

    const socket = io(`ws://${host}:${port}`);
    setSocket(socket);

    socket.on("connect", () => {
      console.log("连接成功");
      //客户端发送进入聊天室
      socket.emit("add user", userInfo.current);
    });

    //客户端监听用户加入聊天室
    socket.on("user joined", ({ id, userList }) => {
      const newContent = [...roomState.current.content];
      newContent.push({ id, message: `${id}加入`, type: "tip" });

      setContent(newContent);
      setUserList(userList);
    });

    //客户端监听新消息
    socket.on("new message", ({ id, message }) => {
      const newContent = [...roomState.current.content];
      newContent.push({ id, message });

      setContent(newContent);
    });

    //客户端监听用户离开聊天室
    socket.on("user leave", function ({ id, userList }) {
      const newContent = [...roomState.current.content];
      newContent.push({ id, message: `${id}离开`, type: "tip" });

      setContent(newContent);
      setUserList(userList);
    });
  };

  const handleEnterSend: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      //客户端发送新消息
      socket.emit("new message", {
        id: userInfo.current.id,
        message,
      });
      setMessage("");
      e.preventDefault();
    }
  };

  const handleButtonSend = () => {
    //客户端发送新消息
    socket.emit("new message", {
      id: userInfo.current.id,
      message,
    });
    setMessage("");
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const val = e.target.value ?? "";
    setMessage(val);
  };

  const handleQuit = () => {
    //断开连接
    socket.disconnect();
  };

  return (
    <div>
      <h2>ChatRoom</h2>
      <h2>id: {userInfo.current.id}</h2>
      <div className="ChatRoom">
        <div className="ChatRoom-header">
          <div>Chat Room · {userList.length}人</div>
          <button className="ChatRoom-header-quit" onClick={handleQuit}>
            退出
          </button>
        </div>
        <div className="ChatRoom-content">
          {content.map(({ id, message, type }, index) => {
            return (
              <div className="ChatRoom-content-item" key={`${id}-${index}`}>
                {type === "tip" ? (
                  <div className="ChatRoom-content-tip">{message}</div>
                ) : (
                  <React.Fragment>
                    <div className="ChatRoom-content-id">{id}</div>
                    <div className="ChatRoom-content-message">{message}</div>
                  </React.Fragment>
                )}
              </div>
            );
          })}
        </div>

        <textarea
          className="ChatRoom-message"
          cols={77}
          rows={10}
          value={message}
          onChange={handleChange}
          onKeyPress={handleEnterSend}
        ></textarea>
        <button onClick={handleButtonSend}>Send</button>
      </div>
      {userList.map((userId) => {
        return <div key={userId}>{userId}</div>;
      })}
    </div>
  );
};

export default memo(ChatRoom);
