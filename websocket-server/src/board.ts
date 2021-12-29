export type Board = {
  width: number;
  height: number;
  players: { [playerId in string]: number };

  role: number;
  stones: number[];
};

export const STONE_NONE = -1;

export const createInitStones = (
  width: number,
  height: number,
  colors: number,
): Board["stones"] => {
  return [
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    0,
    1,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    1,
    0,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
    STONE_NONE,
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
  placeable: number[],
): Board => {
  const stones = board.stones;
  placeable.forEach((index) => {
    stones[index] = board.role;
  });

  return {
    ...board,
    stones: stones,
    role: (board.role + 1) % getColors(board).length,
  };
};

export const calcBoardIndex = (board: Board, x: number, y: number) =>
  y * board.height + x;

export type Directions =
  | [-1, -1]
  | [-1, 0]
  | [-1, 1]
  | [0, -1]
  | [0, 1]
  | [1, -1]
  | [1, 0]
  | [1, 1];

export const recur = (
  board: Board,
  x: number,
  y: number,
  role: number,
  dir: Directions,
  index: number,
): number => {
  const dx = x + dir[0] * index;
  const dy = y + dir[1] * index;

  if (dx < 0 || board.width <= dx || dy < 0 || board.height <= dy) return 0;
  else if (board.stones[calcBoardIndex(board, dx, dy)] === STONE_NONE) return 0;
  else if (board.stones[calcBoardIndex(board, dx, dy)] === role) {
    return index === 1 ? 0 : index;
  } else {
    return recur(board, x, y, role, dir, index + 1);
  }
};

export const calcPlaceableByDirection = (
  board: Board,
  x: number,
  y: number,
  role: number,
  dir: Directions,
): number[] =>
  [...new Array(recur(board, x, y, role, dir, 1))]
    .map((_, i) =>
      calcBoardIndex(board, x + (i + 1) * dir[0], y + (i + 1) * dir[1])
    );

export const calcPlaceable = (
  board: Board,
  role: number,
  x: number,
  y: number,
): number[] => {
  if (board.stones[calcBoardIndex(board, x, y)] !== STONE_NONE) return [];

  const round = [
    ...calcPlaceableByDirection(board, x, y, role, [-1, -1]),
    ...calcPlaceableByDirection(board, x, y, role, [-1, 0]),
    ...calcPlaceableByDirection(board, x, y, role, [-1, 1]),
    ...calcPlaceableByDirection(board, x, y, role, [0, -1]),
    ...calcPlaceableByDirection(board, x, y, role, [0, 1]),
    ...calcPlaceableByDirection(board, x, y, role, [1, -1]),
    ...calcPlaceableByDirection(board, x, y, role, [1, 0]),
    ...calcPlaceableByDirection(board, x, y, role, [1, 1]),
  ];

  if (1 <= round.length) return [calcBoardIndex(board, x, y), ...round];
  return [];
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
  if (!getPlayersIds(board).includes(playerId)) {
    return { status: "bad", message: "NOT_PLAYER" };
  }

  const color = board.players[playerId];
  if (color !== board.role) {
    return { status: "bad", message: "NOT_YOUR_TURN" };
  }

  const placeable = calcPlaceable(board, board.role, x, y);
  if (placeable.length < 1) {
    return { status: "bad", message: "CANNOT_PLACE_HERE" };
  }
  return { "status": "ok", data: createNewBoard(board, placeable) };
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
