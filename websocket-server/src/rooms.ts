import { Room } from "./room.ts";

export class Rooms {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  get roomIds(): string[] {
    return [...this.rooms.entries()].map(([roomId]) => roomId);
  }

  createNewRoom(roomId: string): Room {
    const newRoom: Room = {
      id: roomId,
      name: "Room " + roomId,
      board: undefined,
      sockets: new Map(),
    };
    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  getRoom(roomId: string): Room {
    return this.rooms.get(roomId) || this.createNewRoom(roomId);
  }
}

export const rooms = new Rooms();
