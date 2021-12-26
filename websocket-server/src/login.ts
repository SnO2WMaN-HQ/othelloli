export const handleLogin = (socket: WebSocket, userId: string | null) => {
  socket.addEventListener("open", () => {
    const payload = { userId: userId || crypto.randomUUID() };
    socket.send(JSON.stringify(payload));
  });
};
