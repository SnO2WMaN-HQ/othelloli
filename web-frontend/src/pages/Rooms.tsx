import { useRef } from "react";
import useSWR from "swr";

export const endpointGetRooms = () => {
  const url = new URL("/rooms", import.meta.env.VITE_HTTP_API_BASE_ENDPOINT);
  return url.toString();
};

export const createRoom = (roomId: number) => {
  const url = new URL(
    "/rooms/" + roomId,
    import.meta.env.VITE_HTTP_API_BASE_ENDPOINT,
  ).toString();

  return fetch(url, { method: "POST" });
};

export const Rooms: React.VFC = () => {
  const { data: roomsPayload, mutate } = useSWR<{ rooms: { roomId: string; }[]; }>(endpointGetRooms());

  const ref = useRef<HTMLInputElement>(null);
  const handleCreateRoom = async () => {
    if (!ref.current) return;
    const roomId = parseInt(ref.current.value, 10);

    if (isNaN(roomId)) return;

    await createRoom(roomId);
    await mutate();
  };

  return (
    <div>
      <h1>Rooms</h1>
      <input ref={ref} type="number"></input>
      <button onClick={() => handleCreateRoom()}>Create room</button>
      {roomsPayload && (
        <>
          {roomsPayload.rooms.map(({ roomId }) => (
            <div key={roomId}>
              <a href={`/rooms/${roomId}`}>{roomId}</a>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
