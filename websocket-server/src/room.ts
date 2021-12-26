export class Room {
  private id!: string;

  private sockets!: Map<string, { socket: WebSocket; userId: string; }>;

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

  private get roomSize(): number {
    return this.users.length;
  }

  private broadcast() {
    const roomSize = this.roomSize;
    const users = this.users;

    this.sockets.forEach(({ socket }) => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const payload = {
        roomSize: roomSize,
        users: users,
      };
      socket.send(JSON.stringify(payload));
    });
  }

  addSocket(socket: WebSocket, userId: string) {
    const socketId = crypto.randomUUID();

    socket.addEventListener(
      "open",
      (event) => {
        this.sockets.set(socketId, { socket: socket, userId });
        this.broadcast();
      },
    );
    socket.addEventListener(
      "message",
      (event) => {
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
