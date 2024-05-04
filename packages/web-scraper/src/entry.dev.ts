
import devServer from "./main";

Bun.serve({fetch: devServer.fetch, port: 3000})