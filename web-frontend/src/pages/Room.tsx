import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const useWebSocket = (
  url: string | undefined,
  { onMessage }: { onMessage(event: MessageEvent): void; },
) => {
  const [opened, setOpened] = useState(false);
  const socketRef = useRef<WebSocket>();

  const socketUrl = useMemo(
    () => url ? new URL(url, import.meta.env.VITE_WEBSOCKET_API_BASE_ENDPOINT) : undefined,
    [url],
  );

  useEffect(
    () => {
      if (!socketUrl) return;

      socketRef.current = new WebSocket(socketUrl);
      socketRef.current.addEventListener("open", (event) => {
        setOpened(true);
      });
      socketRef.current.addEventListener("message", (event) => {
        onMessage(event);
      });
      return () => {
        setOpened(false);
        socketRef.current?.close();
      };
    },
    [socketUrl],
  );

  return {
    opened: opened,
    send<T>(payload: T) {
      if (socketRef.current) socketRef.current.send(JSON.stringify(payload));
    },
  };
};

export const Room: React.VFC = () => {
  const { id: roomId } = useParams<"id">();
  const [messages, setMessages] = useState<{ id: string; message: string; }[]>([]);

  const { opened, send } = useWebSocket(
    roomId ? "/rooms/" + roomId : undefined,
    {
      onMessage: (event) => {
        const payload = JSON.parse(event.data);
        setMessages(payload["messages"]);
      },
    },
  );

  const handleClick = () => {
    send({ A: "B" });
  };

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
          <button onClick={handleClick}>Click</button>
          {messages.map(({ id, message }) => <p key={id}>{message}</p>)}
        </>
      )}
    </div>
  );
};
