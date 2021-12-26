import { useLocalStorage } from "react-use";

export const useUserId = (): [
  string | undefined,
  (userId: string) => void,
] => {
  const [storedUserId, storeUserId] = useLocalStorage<string | undefined>("user-id", undefined);

  return [storedUserId, (userId) => storeUserId(userId)];
};
