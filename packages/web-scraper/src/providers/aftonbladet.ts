import Parser from "rss-parser";
import { array,Input,    date,  object, parse, string, url } from "valibot";
import { articleInterface, contentInterface } from "../interfaces";

const aftonbladetRSSValidator = array(
	object({
		title: string(),
		link: string([url()]),
		pubDate: string(),
		enclosure: object({
			url: string([url()]),
			length: string(),
			type: string(),
		}),
    content: string(),
    contentSnippet: string(),
    guid: string(),
    isoDate: string()
	}),
);


async function parseAftonbladetArticle(articleId: string): Promise<Input<typeof articleInterface>> {

  const response = await fetch(`https://www.aftonbladet.se/hyper-api/v1/pages/articles/${articleId}`).then(v=>v.json());

  let hasStarted = false;
  let hasPassed = false;

  const abContentContent = Object.entries(response.items).filter(([key, value]) => {
  
    if (hasPassed) {
      return false;
    }

    if (key === "article-marker-end") {
      hasPassed = true;
      return false;
    }
    if ((key.includes("image") && key !==  "image") || key.includes("ad")) {
      return false;
    }
    
    if (hasStarted) {
      return true;
    }

    if (key === "article-marker-content-start") {
      hasStarted = true;
      return false
    }

    return false;
  }).map(v=>v[1]).map(thing => {
    if (thing.type === "image") {
      return parse(contentInterface, {type: "image", caption: thing?.altText, urls: thing.imageAsset.urls})
    }
    if (thing.type === "text")  {
      return parse(contentInterface, {type: "paragraph", content: thing.text.value, subtype: thing?.subtype});
    }
  });

  const description = parse(string(), response.clientProperties.promotionContent.description.value);
  const title = parse(string(), response.clientProperties.pageTitle);
  const publishedDate = parse(date(), new Date(response.clientProperties.changes.published));

  return {
    title,
    provider: "aftonbladet",
    articleId,
    content: abContentContent,
    description,
    articleLink: parse(string([url()]), response.links.shareUrl),
    publishedDate
  }
}

export async function fromAftonbladet(): Promise<Input<typeof articleInterface>[]> {
  let parser = new Parser();
  let ab = await parser.parseURL(
    "https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt",
  );
  const result = parse(aftonbladetRSSValidator, ab.items);


  return await Promise.all(result.filter(v=>v.guid.startsWith("article:")).map(async article => {
    return await parseAftonbladetArticle(article.guid.replace("article:", ""))
  }))
}