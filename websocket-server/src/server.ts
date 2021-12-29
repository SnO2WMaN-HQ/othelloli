import { bold, yellow } from "https://deno.land/std@0.118.0/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { addSocket as addSocketToRoom } from "./room.ts";

import { Rooms } from "./rooms.ts";

import { handleLogin } from "./login.ts";

const app = new Application();
const router = new Router();

const rooms = new Rooms();

router.get("/login", async (context) => {
  const userId = context.request.url.searchParams.get("userId");

  const socket = await context.upgrade();
  handleLogin(socket, userId);
});

router.get("/random", (context) => {
  context.response.body = { roomId: rooms.getRandomRoomId() };
});

router.get("/rooms/:id", async (context) => {
  const { id: roomId } = context.params;
  const userId = context.request.url.searchParams.get("userId");

  if (!userId) return;

  const socket = await context.upgrade();
  const room = rooms.getRoom(roomId);
  addSocketToRoom(socket, userId, room);
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, serverType }) => {
  console.log(bold(`Start listening on: ${yellow(`${hostname}:${port}`)}`));
  console.log(bold(`using HTTP server: ${yellow(serverType)}`));
});

await app.listen({
  port: parseInt(Deno.env.get("PORT") || "8000", 10),
});
console.log(bold("Finished."));
