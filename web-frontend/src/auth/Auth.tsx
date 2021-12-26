import { useWebSocket } from "~/hooks/useWebSocket";
import { useUserId } from "./useUserId";

export const Auth: React.FC = ({ children }) => {
  const [userId, setUserId] = useUserId();

  useWebSocket(
    userId ? "/login?userId=" + userId : "/login",
    {
      onMessage: (event) => {
        const payload = JSON.parse(event.data);
        const userId = payload["userId"];
        setUserId(userId);
      },
    },
  );

  return <>{children}</>;
};
