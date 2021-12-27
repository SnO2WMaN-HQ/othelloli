export const getUserDetails = (
  userIds: string[],
): { [userId in string]: { name: string } } => {
  return Object.fromEntries(
    Array
      .from(userIds.values())
      .map((userId) => [userId, { name: userId }]),
  );
};
