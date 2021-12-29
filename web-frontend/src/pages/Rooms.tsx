import { useRef } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";

export const endpointGetRandomRoom = () => {
  const url = new URL("/random", import.meta.env.VITE_HTTP_API_BASE_ENDPOINT);
  return url.toString();
};

export const Rooms: React.VFC = () => {
  const { data: roomsPayload, mutate } = useSWR<{ roomId: string; }>(endpointGetRandomRoom());

  return (
    <div>
      <h1>Rooms</h1>
      {roomsPayload && (
        <>
          <Link to={"/rooms/" + roomsPayload.roomId}>
            Random
          </Link>
        </>
      )}
    </div>
  );
};
