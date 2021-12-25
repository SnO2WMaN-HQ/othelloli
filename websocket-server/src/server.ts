import { bold, yellow } from "https://deno.land/std@0.118.0/fmt/colors.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import { rooms } from "./rooms.ts";

const app = new Application();
const router = new Router();

router.get("/rooms", (context) => {
  context.response.body = {
    rooms: rooms.roomIds.map((roomId) => ({ roomId })),
  };
});

router.get("/rooms/:id", async (context) => {
  const { id: roomId } = context.params;
  const socket = await context.upgrade();
  rooms.getRoom(roomId).addSocket(socket);
});

router.post("/rooms/:id", (context) => {
  const { id: roomId } = context.params;
  rooms.createNewRoom(roomId);

  context.response.status = 200;
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
