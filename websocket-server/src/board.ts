export type Board = {
  width: number;
  height: number;
  players: { [playerId in string]: number };

  role: number;
  stones: number[];
};

export const createInitStones = (
  width: number,
  height: number,
  colors: number,
): Board["stones"] => {
  return [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    0,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ];
};

export const getPlayersIds = (board: Board): string[] => {
  return Object.keys(board.players);
};

export const getColors = (board: Board): number[] => {
  return Object.values(board.players);
};

export const createNewBoard = (
  board: Board,
  index: number,
): Board => {
  const stones = board.stones;
  stones[index] = board.role;

  return {
    ...board,
    stones: stones,
    role: (board.role + 1) % getColors(board).length,
  };
};

export const updateBoard = (
  board: Board,
  playerId: string,
  x: number,
  y: number,
):
  | { status: "ok"; data: Board }
  | (
    & { status: "bad" }
    & { message: "NOT_PLAYER" | "NOT_YOUR_TURN" | "CANNOT_PLACE_HERE" }
  ) => {
  if (!Object.keys(board.players).includes(playerId)) {
    return { status: "bad", message: "NOT_PLAYER" };
  }

  const color = board.players[playerId];
  if (color !== board.role) {
    return { status: "bad", message: "NOT_YOUR_TURN" };
  }

  const index = board.height * y + x;
  return { "status": "ok", data: createNewBoard(board, index) };
};

export const countStones = (
  board: Board,
): { [color in number]: number } => {
  const colors = getColors(board);

  return Object.fromEntries(colors.map(
    (color) => [
      color,
      board.stones.filter((stone) => stone === color).length,
    ],
  ));
};

export const getBoardInfo = (
  board: Board,
): {
  width: number;
  height: number;
  role: number;
  stones: number[];
  players: { [x: string]: number };
  counts: { [x: number]: number };
} => {
  return {
    width: board.width,
    height: board.height,
    players: board.players,
    role: board.role,
    stones: board.stones,
    counts: countStones(board),
  };
};
