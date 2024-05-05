import devServer from "./src/main";

Bun.serve({ fetch: devServer.fetch, port: 3000 });
