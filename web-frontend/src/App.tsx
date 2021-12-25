import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import { Room } from "./pages/Room";
import { Rooms } from "./pages/Rooms";
import { defaultFetcher } from "./swr/fetcher";

export const App2: React.VFC = () => {
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<string | undefined>(undefined);

  const ws = new WebSocket("ws://localhost:8000/room/1");

  ws.addEventListener("open", () => {
    setConnected(true);
  });

  ws.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    console.log(payload["uid"]);
  });

  const handleClick = () => {
    ws.send(JSON.stringify({ "a": "B" }));
  };

  if (!connected) {
    return (
      <div>
        <p>Waiting connection</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export const App: React.VFC = () => {
  return (
    <SWRConfig value={{ fetcher: defaultFetcher }}>
      <Routes>
        <Route path="/">
          <Route index element={<Rooms />} />
          <Route path="rooms/:id">
            <Route index element={<Room />} />
          </Route>
        </Route>
      </Routes>
    </SWRConfig>
  );
};
