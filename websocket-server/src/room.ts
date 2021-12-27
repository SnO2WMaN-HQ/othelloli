import { Board } from "./board.ts";
export class Room {
  private id: string;

  private sockets: Map<string, { socket: WebSocket; userId: string; }>;
  private board: Board | undefined;

  constructor(roomId: string) {
    this.id = roomId;

    this.sockets = new Map();
  }

  get roomId() {
    return this.id;
  }

  private get userIds(): string[] {
    return [...new Set([...this.sockets.values()].map(({ userId }) => (userId)))];
  }

  private get users(): { userId: string; }[] {
    return this.userIds.map((userId) => ({ userId }));
  }

  private openGame() {
    const userIds = this.userIds;
    const roomSize = userIds.length;

    if (this.board || roomSize < 2) return;

    this.board = new Board(this.userIds);
  }

  private broadcast() {
    const users = this.users;
    const roomSize = users.length;

    this.sockets.forEach(({ socket }) => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      socket.send(JSON.stringify({
        type: "BROADCAST",
        data: {
          roomName: "Room " + this.roomId,
          roomSize: roomSize,
          users: users,
          board: this.board?.info,
        },
      }));
    });
  }

  addSocket(socket: WebSocket, userId: string) {
    const socketId = crypto.randomUUID();

    socket.addEventListener(
      "open",
      (event) => {
        this.sockets.set(socketId, { socket: socket, userId });
        this.openGame();
        this.broadcast();
      },
    );
    socket.addEventListener(
      "message",
      (event) => {
        const payload = JSON.parse(event.data);
        if (payload["type"] === "PLACE_STONE" && this.board) {
          const userId = payload["userId"];
          const data = payload["data"];
          const { x, y } = data;
          const result = this.board.update(userId, x, y);
          if (result.status === "bad") {
            socket.send(JSON.stringify({ type: "NOTIFICATION", message: result.message }));
          }
        }
        this.broadcast();
      },
    );
    socket.addEventListener(
      "close",
      (event) => {
        this.sockets.delete(socketId);
        this.broadcast();
      },
    );
  }
}
