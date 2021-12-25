export class Room {
  private id!: string;
  private sockets!: Map<string, WebSocket>;
  private messages!: { id: string; createdAt: Date; message: string; }[];

  constructor(roomId: string) {
    this.id = roomId;
    this.sockets = new Map();
    this.messages = [];
  }

  get roomId() {
    return this.id;
  }

  private getMessages(): { id: string; message: string; createdAt: number; }[] {
    return this.messages
      .sort(({ createdAt: a }, { createdAt: b }) => b.getTime() - a.getTime())
      .slice(0, 10)
      .map(
        ({ message, id, createdAt }) => ({ id, message, createdAt: createdAt.getTime() }),
      );
  }

  private broadcast(sourceId: string) {
    this.sockets.forEach((target, targetId) => {
      console.log(target.readyState);
      if (target.readyState !== WebSocket.OPEN) {
        return;
      }

      const payload = {
        sourceId: sourceId,
        targetId: targetId,
        roomSize: this.sockets.size,
        messages: this.getMessages(),
      };
      target.send(JSON.stringify(payload));
    });
  }

  addSocket(ws: WebSocket) {
    const uid = crypto.randomUUID();

    ws.addEventListener("open", () => {
      this.sockets.set(uid, ws);
      this.broadcast(uid);
    });
    ws.addEventListener(
      "message",
      (event) => {
        this.messages.push({
          id: crypto.randomUUID(),
          createdAt: new Date(),
          message: Math.random().toString(23),
        });
        this.broadcast(uid);
      },
    );
  }
}
