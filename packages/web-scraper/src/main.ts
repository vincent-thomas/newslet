import Parser from "rss-parser"

interface Article {
  title: string;
  description: string;
  published_at: Date;
  original_link: string;
}


export default {
  async fetch(request: Request): Promise<Response> {
    let parser = new Parser();
    let ab = await parser.parseURL("https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt");
    console.log(ab)

    // ...
    return new Response("Hello from LearnAWS!", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
};