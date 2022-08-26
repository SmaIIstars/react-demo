import React, { memo, useEffect, useState, useRef } from "react";
import moment from "moment";
import { io } from "socket.io-client";
import Player from "./Game/Player";
import { teamColor } from "./Game/constant";
import TWEEN, { Tween } from "@tweenjs/tween.js";
import useUrlState from "@ahooksjs/use-url-state";

import "./index.less";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

type Action = {
  actionId: string;
  actionType: -1 | 1;
  ts: number;
};

const GameDemo = () => {
  const [socket, setSocket] = useState<any>();
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [serverPlayerList, setServerPlayerList] = useState<Player[]>([]);
  const [query, setQuery] = useUrlState({ port: 3101, host: "localhost" });

  const curPlayer = useRef(new Player({ id: nanoid(), speed: 5 }));
  const btnTimer = useRef<number>(0);
  const actionList = useRef<Action[]>([]);
  const prePlayerList = useRef<Player[]>([]);

  useEffect(() => {
    initSocket();
  }, []);

  const initSocket = () => {
    const { host, port } = query;
    console.error(host, port);

    const socket = io(`http://${host}:${port}`, { path: "/game-demo" });
    socket.id = curPlayer.current.id;
    console.error(socket);

    setSocket(socket);

    socket.on("connect", () => {
      // 创建玩家
      socket.emit("create-player", { id: curPlayer.current.id });
    });

    socket.on("create-player-done", ({ playerList }) => {
      setPlayerList(playerList);
      const curPlayerIndex = (playerList as Player[]).findIndex(
        (player) => player.id === curPlayer.current.id
      );
      curPlayer.current.socketId = playerList[curPlayerIndex].socketId;
    });

    socket.on("player-disconnect", ({ id, playerList }) => {
      setPlayerList(playerList);
    });

    socket.on("interval-update", ({ state }) => {
      curPlayer.current.state = state;
    });

    socket.on(
      "update-state",
      ({
        playerList,
        actionId: _actionId,
      }: {
        playerList: Player[];
        actionId: string;
        ts: number;
      }) => {
        setPlayerList(playerList);

        const player = playerList.find((p) => curPlayer.current.id === p.id);
        if (player) {
          // 和解
          if (player.reconciliation && _actionId) {
            const actionIndex = actionList.current.findIndex(
              (action) => action.actionId === _actionId
            );

            let pivot = 0;
            for (let i = actionIndex; i < actionList.current.length; i++) {
              pivot += actionList.current[i].actionType;
            }

            const newPlayerState = cloneDeep(player);
            newPlayerState.state.x += pivot * player.speed;
            curPlayer.current = newPlayerState;
          } else {
            curPlayer.current = player;
          }
        }

        playerList.forEach((player) => {
          if (player.interpolation && player.id !== curPlayer.current.id) {
            // 插值
            const prePlayerIndex = prePlayerList.current.findIndex(
              (p) => player.id === p.id
            );
            // 第一次记录
            if (prePlayerIndex === -1) {
              prePlayerList.current.push(player);
            } else {
              // 如果已经有过去的状态
              const thumbEl = document.getElementById(`thumb-${player.id}`);

              if (thumbEl) {
                const prePos = {
                  x: prePlayerList.current[prePlayerIndex].state.x,
                };
                // console.error(prePos.x, player.state.x);

                new TWEEN.Tween(prePos)
                  .to({ x: player.state.x }, 100)
                  .onUpdate(() => {
                    thumbEl.style.setProperty(
                      "transform",
                      `translateX(${prePos.x}px)`
                    );
                    console.error("onUpdate", 2, prePos.x);
                  })
                  .start();
              }
              prePlayerList.current[prePlayerIndex] = player;
            }
          }
        });
      }
    );

    socket.on("update-real-state", ({ playerList }) => {
      setServerPlayerList(playerList);
    });
  };

  const handleLeft = () => {
    const { id, predict, speed, reconciliation } = curPlayer.current;
    // 和解
    if (reconciliation) {
      const actionId = uuidv4();
      actionList.current.push({ actionId, actionType: -1, ts: Date.now() });
      socket.emit("handle-left", { id, actionId });
    } else {
      socket.emit("handle-left", { id });
    }

    // 预测
    if (predict) {
      curPlayer.current.state.x -= speed;
    }

    btnTimer.current = window.requestAnimationFrame(handleLeft);
    TWEEN.update();
  };

  const handleRight = (time?: number) => {
    const { id, predict, speed, reconciliation } = curPlayer.current;
    // 和解
    if (reconciliation) {
      const actionId = uuidv4();
      actionList.current.push({ actionId, actionType: 1, ts: Date.now() });
      socket.emit("handle-right", { id, actionId });
    } else {
      socket.emit("handle-right", { id });
    }
    // 预测
    if (predict) {
      curPlayer.current.state.x += speed;
    }

    // socket.emit("handle-right", { id });

    btnTimer.current = window.requestAnimationFrame(handleRight);
    TWEEN.update();
  };

  return (
    <div>
      <div>
        当前用户
        <div>{curPlayer.current.id}</div>
        在线用户
        {playerList.map((player) => {
          return (
            <div
              key={player.id}
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div>{player.id}</div>
              <div>{moment(player.enterRoomTS).format("HH:mm:ss")}</div>
            </div>
          );
        })}
      </div>

      {playerList.map((player, index) => {
        const mySelf = player.id === curPlayer.current.id;
        const disabled = !mySelf;

        return (
          <div className="player-wrapper" key={player.id}>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div style={{ color: mySelf ? "red" : "black" }}>{player.id}</div>
              <div>
                预测
                <input
                  disabled={disabled}
                  type="checkbox"
                  checked={player.predict}
                  onChange={() => {
                    socket.emit("predict-change", {
                      id: curPlayer.current.id,
                      predict: !player.predict,
                    });
                  }}
                ></input>
              </div>
              <div>
                和解
                <input
                  disabled={disabled}
                  type="checkbox"
                  checked={player.reconciliation}
                  onChange={() => {
                    socket.emit("reconciliation-change", {
                      id: curPlayer.current.id,
                      reconciliation: !player.reconciliation,
                    });
                  }}
                ></input>
              </div>
              <div>
                插值
                <input
                  // disabled={!disabled}
                  disabled={true}
                  type="checkbox"
                  checked={player.interpolation}
                  onChange={() => {
                    socket.emit("interpolation-change", {
                      id: player.id,
                      interpolation: !player.interpolation,
                    });
                  }}
                ></input>
              </div>
            </div>

            <div>Client</div>
            {mySelf ? (
              <div className="track">
                <div
                  id={`thumb-${player.id}`}
                  className="left"
                  style={{
                    backgroundColor: teamColor[player.state.team],
                    transform: `translateX(${
                      // 是否预测
                      curPlayer.current.predict
                        ? curPlayer.current.state.x
                        : player.state.x
                    }px)`,
                  }}
                >
                  自己
                </div>
              </div>
            ) : (
              <div className="track">
                <div
                  id={`thumb-${player.id}`}
                  className="left"
                  style={
                    // 是否插值
                    player.interpolation
                      ? {
                          backgroundColor: teamColor[player.state.team],
                        }
                      : {
                          backgroundColor: teamColor[player.state.team],
                          transform: `translateX(${player.state.x}px)`,
                        }
                  }
                >
                  别人
                </div>
              </div>
            )}

            <div>Server</div>
            {serverPlayerList.length && (
              <div className="server-track">
                <div
                  className="left"
                  style={{
                    backgroundColor: teamColor[player.state.team],
                    transform: `translateX(${
                      serverPlayerList[index]?.state?.x ?? 0
                    }px)`,
                  }}
                ></div>
              </div>
            )}

            <div>
              delay:
              <input
                type="number"
                min={1}
                max={3000}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  socket.emit("delay-change", {
                    delay: val,
                    id: curPlayer.current.id,
                  });
                }}
                value={player.delay}
                disabled={disabled}
              ></input>
              speed:
              <input
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  socket.emit("speed-change", {
                    speed: val,
                    id: curPlayer.current.id,
                  });
                }}
                value={player.speed}
                disabled={disabled}
              ></input>
            </div>
            <button
              onMouseDown={() => {
                window.requestAnimationFrame(handleLeft);
              }}
              onMouseUp={() => {
                cancelAnimationFrame(btnTimer.current);
              }}
              disabled={disabled}
            >
              左
            </button>
            <button
              onMouseDown={() => {
                window.requestAnimationFrame(handleRight);
              }}
              onMouseUp={() => {
                cancelAnimationFrame(btnTimer.current);
              }}
              disabled={disabled}
            >
              右
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default memo(GameDemo);
