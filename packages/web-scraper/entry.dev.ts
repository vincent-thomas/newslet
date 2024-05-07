import devServer from "./src/main";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
const app = new Hono();

app.get("/", async (c) => {
	return await devServer.fetch();
});

console.log("serving...");
serve(app);
