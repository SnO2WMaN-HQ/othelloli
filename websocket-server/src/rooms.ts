import { Room } from "./room.ts";

export class Rooms {
  private rooms!: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  get roomIds(): string[] {
    return [...this.rooms.entries()].map(([roomId]) => roomId);
  }

  createNewRoom(roomId: string) {
    const newRoom = new Room(roomId);
    this.rooms.set(roomId, newRoom);
  }

  getRoom(roomId: string): Room {
    const existsRoom = this.rooms.get(roomId);
    if (existsRoom) {
      return existsRoom;
    }

    const newRoom = new Room(roomId);
    this.rooms.set(roomId, newRoom);
    return newRoom;
  }
}

export const rooms = new Rooms();
