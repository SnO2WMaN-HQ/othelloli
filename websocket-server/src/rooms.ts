import { Room } from "./room.ts";

export class Rooms {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  private get roomIds(): string[] {
    return [...this.rooms.entries()].map(([roomId]) => roomId);
  }

  private notMatchingRoomIds(): string[] {
    return [...this.rooms.entries()]
      .filter(([_, room]) => !room.board)
      .map(([roomId]) => roomId);
  }

  private createNewRoom(roomId: string): Room {
    const newRoom: Room = {
      id: roomId,
      name: "Room " + roomId,
      board: undefined,
      sockets: new Map(),
    };
    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  getRandomRoomId(): string {
    const roomIds = this.notMatchingRoomIds();
    if (0 < roomIds.length) {
      return roomIds[Math.floor(roomIds.length * Math.random())];
    } else {
      return this.createNewRoom(crypto.randomUUID()).id;
    }
  }

  getRoom(roomId: string): Room {
    return this.rooms.get(roomId) || this.createNewRoom(roomId);
  }
}
