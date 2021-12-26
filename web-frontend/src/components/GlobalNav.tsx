import React from "react";
import { useUserId } from "~/auth/useUserId";

export const GlobalNav: React.VFC = () => {
  const [userId] = useUserId();
  return (
    <nav>
      {userId && <span>{userId}</span>}
    </nav>
  );
};
