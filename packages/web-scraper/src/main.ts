import { fromAftonbladet } from "./providers/aftonbladet";
import { fromGP } from "./providers/gp";

export default {
	async fetch(): Promise<Response> {
    const ab = await fromAftonbladet();
    const gp = await fromGP();

		return  Response.json([...ab,...gp], {
			status: 200,
		});
	},
};