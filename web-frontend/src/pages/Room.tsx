import clsx from "clsx";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserId } from "~/auth/useUserId";
import { Board } from "~/components/Board";
import { RoomInfo } from "~/components/RoomInfo";
import { useWebSocket } from "~/hooks/useWebSocket";

export const Room: React.VFC = () => {
  const { id: roomId } = useParams<"id">();

  const [userId] = useUserId();
  const [room, setRoom] = useState<
    {
      roomName: string;
      roomSize: number;
      users: { userId: string; role: number | undefined; }[];
      board:
        | { width: number; height: number; role: number; stones: number[]; counts: { [key in number]: number; }; }
        | undefined;
    } | undefined
  >(undefined);

  const handleNotification = (message: "NOT_YOUR_TIME" | "NOT_PLAYER" | "CANNOT_PLACE_HERE") => {
    console.log(message);
  };
  const handleBroadcast = (data: any) => {
    const roomName = data["roomName"];
    const roomSize = data["roomSize"];
    const users = data["users"];
    const board = data["board"];
    if (board) {
      setRoom({
        roomName: roomName,
        roomSize: roomSize,
        users: users.map(({ userId, ...rest }: any) => ({ userId, ...rest, role: board.players[userId] })),
        board: {
          width: board["width"],
          height: board["height"],
          role: board["role"],
          stones: board["stones"],
          counts: board["counts"],
        },
      });
    } else {
      setRoom({
        roomName: roomName,
        roomSize: roomSize,
        users: users,
        board: undefined,
      });
    }
  };

  const { send } = useWebSocket(
    userId && roomId ? "/rooms/" + roomId + "?userId=" + userId : undefined,
    {
      onOpened: () => {
        send({ userId, type: "ROOM_IN" });
      },
      onMessage: (event) => {
        const payload = JSON.parse(event.data);
        const type = payload["type"];

        switch (type) {
          case "NOTIFICATION":
            handleNotification(payload["message"]);
            break;
          case "BROADCAST":
            handleBroadcast(payload["data"]);
            break;
        }
      },
    },
  );

  const handleClick = (x: number, y: number) => {
    if (!userId) return;
    send({ userId: userId, type: "PLACE_STONE", data: { x: x, y: y } });
  };

  return (
    <main>
      {room &&
        (
          <div
            className={clsx(
              ["container"],
              ["mx-auto"],
              ["flex"],
              ["bg-cyan-50"],
            )}
          >
            <div
              className={clsx(
                ["flex-grow"],
                ["px-4"],
                ["py-4"],
                ["flex", ["justify-center"], ["items-center"]],
              )}
            >
              <Board
                className={clsx(
                  ["w-[480px]"],
                  ["h-[480px]"],
                )}
                handleClick={handleClick}
                board={room.board}
              />
            </div>
            <div
              className={clsx(
                ["px-4"],
                ["py-4"],
                ["flex-shrink"],
              )}
            >
              <RoomInfo
                className={clsx(
                  ["max-w-[280px]"],
                  ["h-full"],
                )}
                roomName={room.roomName}
                roomSize={room.roomSize}
                users={room.users}
                board={room.board}
              />
            </div>
          </div>
        )}
    </main>
  );
};
