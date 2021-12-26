import { useEffect, useMemo, useRef, useState } from "react";

export const useWebSocket = (
  url: string | undefined,
  { onOpened, onMessage }: {
    onOpened?(event: Event): void;
    onMessage?(event: MessageEvent): void;
  },
) => {
  const [opened, setOpened] = useState(false);
  const socketRef = useRef<WebSocket>();

  const socketUrl = useMemo(
    () => url ? new URL(url, import.meta.env.VITE_WEBSOCKET_API_BASE_ENDPOINT) : undefined,
    [url],
  );

  useEffect(
    () => {
      if (!socketUrl) {
        return;
      }

      socketRef.current = new WebSocket(socketUrl);
      socketRef.current.addEventListener("open", (event) => {
        setOpened(true);
        if (onOpened) {
          onOpened(event);
        }
      });
      socketRef.current.addEventListener("message", (event) => {
        if (onMessage) {
          onMessage(event);
        }
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
    send<T extends Record<string, any>>(payload: T) {
      if (socketRef.current) {
        socketRef.current.send(JSON.stringify(payload));
      }
    },
  };
};
