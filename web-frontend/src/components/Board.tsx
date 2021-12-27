import clsx from "clsx";
import { chunk } from "lodash";
import { useMemo } from "react";

export const stonesParser = (stones: number[], width: number, height: number): number[][] => {
  return chunk(stones, width);
};

export const STONE_NONE = -1;
export const STONE_WHITE = 0;
export const STONE_BLACK = 1;

export const Board: React.VFC<{
  className?: string;
  handleClick(x: number, y: number): void;
  board: undefined | { width: number; height: number; role: number; stones: number[]; };
}> = (
  { className, handleClick, board },
) => {
  const mesh = useMemo(() => board && stonesParser(board.stones, board.width, board.height), [board]);

  return (
    <div
      className={clsx(
        className,
        ["bg-cyan-700"],
        ["shadow-lg", ["shadow-cyan-900/25"]],
        ["rounded-lg"],
        ["px-4"],
        ["py-4"],
        board && [
          "grid",
          ["gap-x-0.5"],
          ["gap-y-0.5"],
        ],
      )}
      style={board && {
        gridTemplateColumns: "repeat(" + board.width + ", minmax(0, 1fr))",
        gridTemplateRows: "repeat(" + board.height + ", minmax(0, 1fr))",
      }}
    >
      {!mesh && (
        <div
          className={clsx(
            ["w-full"],
            ["h-full"],
            ["flex", ["justify-center", ["items-center"]]],
          )}
        >
          <span className={clsx(["text-2xl"], ["text-cyan-50"])}>Matching</span>
        </div>
      )}
      {mesh && mesh.map((row, y) => (
        row.map((pixel, x) => (
          <div
            key={"pixel-" + x + "-" + y}
            className={clsx(
              ["px-1"],
              ["py-1"],
              ["bg-transparent", "hover:bg-cyan-50/25"],
              ["border", "border-cyan-50/25"],
            )}
            onClick={() => {
              handleClick(x, y);
            }}
          >
            <div
              className={clsx(
                ["w-full"],
                ["h-full"],
                ["rounded-full"],
                [pixel !== STONE_NONE && "border", "border-cyan-100/75"],
                [pixel === STONE_WHITE && ["bg-cyan-800"]],
                [pixel === STONE_BLACK && ["bg-cyan-50"]],
              )}
            />
          </div>
        ))
      ))}
    </div>
  );
};
