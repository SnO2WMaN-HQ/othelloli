import {
  Board,
  createInitStones,
  getBoardInfo as getBoardInfo,
  getPlayersIds as getPlayersIdsInBoard,
  updateBoard,
} from "./board.ts";
import { getUserDetails } from "./users.ts";

export type Room = {
  id: string;
  name: string;
  sockets: Map<WebSocket, string>;
  board: Board | undefined;
};

export const connectedUsers = (
  room: Room,
): string[] => {
  return Array.from(new Set(room.sockets.values()));
};

export const unconnectedUsers = (
  room: Room,
): string[] => {
  const connected = connectedUsers(room);
  const playerIds = room.board ? getPlayersIdsInBoard(room.board) : [];
  return playerIds.filter((playerId) => !connected.includes(playerId));
};

export const expectedUsers = (
  room: Room,
): { [userId in string]: { name: string; connected: boolean } } => {
  const connected = connectedUsers(room);
  const unconnected = unconnectedUsers(room);

  const userDetails = getUserDetails([...connected, ...unconnected]);

  return Object.fromEntries(
    Object
      .entries(userDetails)
      .map(([userId, userDetails]) => [
        userId,
        { ...userDetails, connected: !unconnected.includes(userId) },
      ]),
  );
};

export const startGame = (room: Room):
  | { status: "ok" }
  | (
    & { status: "bad" }
    & { message: "ALREADY_OPENED" | "NOT_ENOUGH_PLAYERS" }
  ) => {
  if (room.board) return { status: "bad", message: "ALREADY_OPENED" };

  const connected = connectedUsers(room);
  if (connected.length < 2) {
    return { status: "bad", message: "NOT_ENOUGH_PLAYERS" };
  }

  room.board = {
    width: 8,
    height: 8,
    role: 0,
    stones: createInitStones(8, 8, 2),
    players: { [connected[0]]: 0, [connected[1]]: 1 },
  };
  return { status: "ok" };
};

export const broadcast = (
  room: Room,
): void => {
  const users = expectedUsers(room);
  const boardInfo = room.board ? getBoardInfo(room.board) : undefined;

  const sendData = {
    id: room.id,
    name: room.name,
    users: users,
    board: boardInfo,
  };

  room.sockets.forEach((_, socket) => {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify({
      type: "BROADCAST",
      data: sendData,
    }));
  });
};

export const addSocket = (
  socket: WebSocket,
  userId: string,
  room: Room,
) => {
  socket.addEventListener(
    "open",
    (event) => {
      room.sockets.set(socket, userId);

      const result = startGame(room);
      console.dir(result);

      broadcast(room);
    },
  );
  socket.addEventListener(
    "message",
    (event) => {
      const payload = JSON.parse(event.data);

      if (payload["type"] === "PLACE_STONE" && room.board) {
        const userId = payload["userId"];
        const data = payload["data"];
        const { x, y } = data;

        const result = updateBoard(room.board, userId, x, y);
        if (result.status === "bad") {
          socket.send(
            JSON.stringify({ type: "NOTIFICATION", message: result.message }),
          );
        } else {
          room.board = result.data;
        }
      }
      broadcast(room);
    },
  );
  socket.addEventListener(
    "close",
    (event) => {
      room.sockets.delete(socket);
      broadcast(room);
    },
  );
};
