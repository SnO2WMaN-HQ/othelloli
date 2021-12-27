export class Board {
  readonly width: number;
  readonly height: number;

  private $role: number;
  readonly stones: number[];

  private playersMap: Map<string, number>;

  constructor(players: string[]) {
    this.width = 8;
    this.height = 8;

    this.$role = 0;
    this.playersMap = new Map(players.map((userId, i) => [userId, i + 1]));
    this.stones = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
  }

  private get players() {
    return Object.fromEntries([...this.playersMap.entries()]);
  }

  private get colors() {
    return [...this.playersMap.values()];
  }

  private get role() {
    return this.$role + 1;
  }

  private get counts() {
    return Object.fromEntries(
      this.colors.map((color) => [color, this.stones.filter((stone) => stone === color).length]),
    );
  }

  get info() {
    return {
      width: this.width,
      height: this.height,
      players: this.players,
      role: this.role,
      stones: this.stones,
      counts: this.counts,
    };
  }

  private checkRole(index: number, role: number): boolean {
    return true;
  }

  private place(index: number, role: number): void {
    this.stones[index] = this.role;
  }

  private switchRole() {
    this.$role++;
    this.$role %= this.colors.length;
  }

  update(
    playerId: string,
    x: number,
    y: number,
  ):
    | (
      & { status: "bad"; }
      & ({ message: "NOT_PLAYER"; } | { message: "NOT_YOUR_TURN"; } | { message: "CANNOT_PLACE_HERE"; })
    )
    | { status: "ok"; } {
    const color = this.playersMap.get(playerId);

    if (!color) return { status: "bad", message: "NOT_PLAYER" };
    if (color !== this.role) return { status: "bad", message: "NOT_YOUR_TURN" };

    const index = this.height * y + x;

    if (!this.checkRole(index, this.role)) return { status: "bad", message: "CANNOT_PLACE_HERE" };

    this.place(index, this.role);
    this.switchRole();

    return { status: "ok" };
  }
}
