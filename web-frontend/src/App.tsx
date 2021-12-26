import React from "react";
import { Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import { Auth } from "~/auth/Auth";
import { Room } from "~/pages/Room";
import { Rooms } from "~/pages/Rooms";
import { defaultFetcher } from "~/swr/fetcher";
import { Template } from "~/templates/Template";

export const App: React.VFC = () => {
  return (
    <SWRConfig value={{ fetcher: defaultFetcher }}>
      <Auth>
        <Routes>
          <Route path="/" element={<Template></Template>}>
            <Route index element={<Rooms />} />
            <Route path="rooms/:id">
              <Route index element={<Room />} />
            </Route>
          </Route>
        </Routes>
      </Auth>
    </SWRConfig>
  );
};
