import clsx from "clsx";
import { useMemo } from "react";
import { STONE_BLACK, STONE_WHITE } from "./Board";

export const View: React.VFC<
  {
    className?: string;
    roomName: string;
    roomSize: number;
    players: { userId: string; name: string; role: number; count: number; isCurrent: boolean; }[] | undefined;
    nonPlayers: { userId: string; name: string; }[];
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
          <p className={clsx(["text-cyan-50"], ["text-md"])}>Players</p>
          {players && (
            <ul
              className={clsx(
                ["mt-2"],
                ["rounded"],
                ["bg-cyan-200"],
                ["border", "border-cyan-100"],
                ["divide-y", ["divide-cyan-100"]],
              )}
            >
              {players.map(({ userId, name, role, isCurrent }) => (
                <li key={userId} className={clsx(["flex", ["items-center"]], ["px-1"], ["py-1"])}>
                  <div className={clsx(["bg-cyan-700"], ["px-1"], ["py-1"], ["rounded"])}>
                    <div
                      className={clsx(
                        ["w-6"],
                        ["h-6"],
                        ["rounded-full"],
                        ["border", "border-cyan-100/75"],
                        [role === STONE_WHITE && ["bg-cyan-800"]],
                        [role === STONE_BLACK && ["bg-cyan-50"]],
                      )}
                    />
                  </div>
                  <div className={clsx(["ml-2"], ["overflow-hidden"])}>
                    <span
                      className={clsx(["block"], [
                        ["text-cyan-800"],
                        ["text-sm"],
                        [!isCurrent && ["font-normal"], isCurrent && ["font-bold"]],
                        ["truncate"],
                        ["font-mono"],
                      ])}
                    >
                      {name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={clsx(["mt-4"])}>
          <p className={clsx(["text-cyan-50"], ["text-md"])}>Non Players</p>
          <ul
            className={clsx(
              ["mt-2"],
              ["rounded"],
              ["bg-cyan-200"],
              ["border", "border-cyan-100"],
              ["divide-y", ["divide-cyan-100"]],
            )}
          >
            {nonPlayers.map(({ userId, name }) => (
              <li key={userId} className={clsx(["px-1"], ["py-1"])}>
                <div className={clsx(["overflow-hidden"])}>
                  <span
                    className={clsx(
                      ["block"],
                      [["text-cyan-800"], ["text-sm"], ["truncate"], ["font-mono"]],
                    )}
                  >
                    {name}
                  </span>
                </div>
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
    users: Record<string, { name: string; }>;
    board: {
      role: number;
      counts: { [color in number]: number; };
      players: { [userId in string]: number; };
    } | undefined;
  }
> = ({ users, board, ...props }) => {
  const { players, nonPlayers } = useMemo(
    () =>
      board
        ? {
          players: Object.entries(board.players).map(
            ([userId, role]) => ({
              userId,
              name: users[userId].name,
              role,
              count: board.counts[role],
              isCurrent: role === board.role,
            }),
          ),
          nonPlayers: Object.entries(users).filter(
            ([userId]) => !Object.keys(board.players).includes(userId),
          ).map(([userId, { name }]) => ({ userId, name })),
        }
        : {
          players: undefined,
          nonPlayers: Object.entries(users).map(([userId, { name }]) => ({ userId, name })),
        },
    [board, users],
  );

  return (
    <View
      {...props}
      roomSize={Object.keys(users).length}
      players={players}
      nonPlayers={nonPlayers}
    />
  );
};
