import clsx from "clsx";
import { useMemo } from "react";
import { STONE_BLACK, STONE_WHITE } from "./Board";

export const View: React.VFC<
  {
    className?: string;
    roomName: string;
    roomSize: number;
    players: { userId: string; role: number; count: number; isCurrent: boolean; }[] | undefined;
    nonPlayers: { userId: string; }[];
  }
> = ({ className, roomName: roomName, roomSize, players, nonPlayers: nonPlayers }) => {
  return (
    <div
      className={clsx(
        className,
        ["flex", ["flex-col"]],
        ["px-4"],
        ["py-4"],
        ["bg-cyan-300"],
        ["shadow-lg", "shadow-cyan-400/25"],
        ["rounded-lg"],
      )}
    >
      <div className={clsx(["mt-2"], ["flex", ["items-center"]])}>
        <span
          className={clsx(
            ["inline-block"],
            ["flex-grow"],
            [["text-cyan-50"], ["text-xl"], ["font-bold"]],
          )}
        >
          {roomName}
        </span>
        <span
          className={clsx(
            ["inline-block"],
            ["px-4"],
            ["py-1"],
            ["bg-cyan-400"],
            ["rounded-md"],
            [["text-cyan-50"], ["text-md"], ["leading-none"], ["font-mono"], ["font-bold"]],
          )}
        >
          {roomSize}
        </span>
      </div>
      <div className={clsx(["flex-grow"], ["mt-4"])}>
        <div>
          {players && (
            <ul
              className={clsx(
                ["rounded"],
                ["bg-cyan-200"],
                ["border", "border-cyan-100"],
                ["divide-y", ["divide-cyan-100"]],
              )}
            >
              {players.map(({ userId }) => (
                <li key={userId} className={clsx(["px-2"], ["py-1"])}>
                  <span
                    className={clsx(
                      ["block"],
                      [["text-cyan-800"], ["text-sm"], ["font-mono"]],
                    )}
                  >
                    {userId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={clsx(["mt-4"])}>
          <ul
            className={clsx(
              ["rounded"],
              ["bg-cyan-200"],
              ["border", "border-cyan-100"],
              ["divide-y", ["divide-cyan-100"]],
            )}
          >
            {nonPlayers.map(({ userId }) => (
              <li key={userId} className={clsx(["px-2"], ["py-1"])}>
                <span
                  className={clsx(
                    ["block"],
                    [["text-cyan-800"], ["text-sm"], ["font-mono"]],
                  )}
                >
                  {userId}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const RoomInfo: React.VFC<
  {
    className?: string;
    roomName: string;
    roomSize: number;
    users: { userId: string; role: number | undefined; }[];
    board: { role: number; counts: { [key in number]: number; }; } | undefined;
  }
> = ({ users, board, ...props }) => {
  const { players, nonPlayers } = useMemo(
    () =>
      board
        ? {
          players: users.filter(({ role }) => !!role).map(({ userId, role }) => ({
            userId,
            role: role!,
            count: board.counts[role!],
            isCurrent: board.role === role!,
          })),
          nonPlayers: users.filter(({ role }) => !role).map(({ userId }) => ({ userId })),
        }
        : {
          players: undefined,
          nonPlayers: users.map(({ userId }) => ({ userId })),
        },
    [board, users],
  );

  return (
    <View
      {...props}
      players={players}
      nonPlayers={nonPlayers}
    />
  );
};
