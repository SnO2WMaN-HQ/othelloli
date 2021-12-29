import React from "react";
import { Outlet } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import { GlobalNav } from "~/components/GlobalNav";

export const Template: React.VFC = () => {
  return (
    <div>
      <Toaster></Toaster>
      <GlobalNav></GlobalNav>
      <Outlet></Outlet>
    </div>
  );
};
