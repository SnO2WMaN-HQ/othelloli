import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserId } from "~/auth/useUserId";
import { useWebSocket } from "~/hooks/useWebSocket";

export const Room: React.VFC = () => {
  const { id: roomId } = useParams<"id">();

  const [userId] = useUserId();
  const [roomSize, setRoomSize] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<{ userId: string; }[]>([]);

  const { opened, send } = useWebSocket(
    userId && roomId ? "/rooms/" + roomId + "?userId=" + userId : undefined,
    {
      onOpened: () => {
        send({ userId });
      },
      onMessage: (event) => {
        const payload = JSON.parse(event.data);
        setRoomSize(payload["roomSize"]);
        setUsers(payload["users"]);
      },
    },
  );

  return (
    <div>
      <h1>
        Room
        <span>{roomId}</span>
      </h1>
      {!opened && (
        <>
          <p>Connecting</p>
        </>
      )}
      {opened && (
        <>
          {roomSize && <span>{roomSize}</span>}
          {users.map(({ userId }) => (
            <div key={userId}>
              <span>{userId}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
