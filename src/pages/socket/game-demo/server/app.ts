import { Server } from "socket.io";
import Player from "../Game/Player";
import { cloneDeep } from "lodash";

const args = process.argv.splice(2);
const port = parseInt(args[0] ?? 3101);

const io = new Server(port, { cors: { origin: "*" } });

console.error(io);

const playerList: Player[] = [];

const getCurPlayerById = (id: string) =>
  getPlayerList().find((player) => player.id === id);

const getPlayerList = () => playerList;

const updateDelayPlayerState = (delay?: number, id?: string, ts?: number) => {
  const oldPlayerList = cloneDeep(getPlayerList());
  setTimeout(() => {
    io.emit("update-state", {
      playerList: oldPlayerList,
      actionId: id,
      ts,
    });
  }, delay);
};

const updateServerPlayerState = () => {
  io.emit("update-real-state", { playerList: getPlayerList() });
};

io.on("connection", (socket) => {
  console.log("socket connected successful", socket.id);

  // 玩家通信
  socket.on("create-player", (payload) => {
    const player = new Player({ id: payload?.id });
    player.socketId = socket.id;

    if (playerList.findIndex((item) => player.id === item.id) === -1) {
      playerList.push(player);
    }

    io.emit("create-player-done", {
      playerList: getPlayerList(),
    });
    updateServerPlayerState();
  });

  socket.on("disconnect", () => {
    const playerIndex = playerList.findIndex(
      (player) => player.socketId === socket.id
    );

    if (playerIndex !== -1) {
      playerList.splice(playerIndex, 1);

      socket.broadcast.emit("player-disconnect", {
        id: socket.id,
        playerList,
      });
    }
  });

  // 状态同步
  socket.on("handle-left", ({ id, actionId }) => {
    const player = getCurPlayerById(id);

    if (player) {
      player.state.x -= player.speed;

      updateDelayPlayerState(player.delay, actionId);
      updateServerPlayerState();
    }
  });

  socket.on("handle-right", ({ id, actionId }) => {
    const player = getCurPlayerById(id);

    if (player) {
      player.state.x += player.speed;
      updateDelayPlayerState(player.delay, actionId);
      updateServerPlayerState();
    }
  });

  // 调试配置
  socket.on("delay-change", ({ delay, id }) => {
    const player = getCurPlayerById(id);
    if (player) {
      player.delay = delay;

      updateDelayPlayerState(0);
      updateServerPlayerState();
    }
  });

  socket.on("speed-change", ({ speed, id }) => {
    const player = getCurPlayerById(id);
    if (player) {
      player.speed = speed;
      updateDelayPlayerState(0);
      updateServerPlayerState();
    }
  });

  socket.on("predict-change", ({ id, predict }) => {
    const player = getCurPlayerById(id);
    if (player) {
      player.predict = predict;

      updateDelayPlayerState(0);
      updateServerPlayerState();
    }
  });

  socket.on("reconciliation-change", ({ id, reconciliation }) => {
    const player = getCurPlayerById(id);
    if (player) {
      player.reconciliation = reconciliation;

      updateDelayPlayerState(0);
      updateServerPlayerState();
    }
  });

  socket.on("interpolation-change", ({ id, interpolation }) => {
    const player = getCurPlayerById(id);
    if (player) {
      player.interpolation = interpolation;

      updateDelayPlayerState(0);
      updateServerPlayerState();
    }
  });
});
