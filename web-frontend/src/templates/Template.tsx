import React from "react";
import { Outlet } from "react-router-dom";

import { GlobalNav } from "~/components/GlobalNav";

export const Template: React.VFC = () => {
  return (
    <div>
      <GlobalNav></GlobalNav>
      <Outlet></Outlet>
    </div>
  );
};
