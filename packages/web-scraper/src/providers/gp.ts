import { Input, boolean, object, parse, string, url } from "valibot";
import { articleInterface, contentInterface } from "../interfaces";
const gpValidator = object({
  article: object({
    uuid: string(),
    title: string(),
    url: string([url()]),
    /**  ISO */
    publishDate: string(),
    body: string(),
    lead: string(),
    premium: boolean()
  })
});
async function parseGPArticle(articleId:string): Promise<Input<typeof articleInterface>> {
  const result = await fetch(`https://www.gp.se/api/queryArticle/${articleId}`).then(v=>v.json()).then(v=>parse(gpValidator, v));

  const content: Input<typeof contentInterface>[] = JSON.parse(result.article.body).items.filter(value => {
    return value?.type === "paragraph"
  }).map(value => {
    if (value.type === "paragraph") {
      return parse(contentInterface, {
        type: "paragraph",
        content: value.text
      });
    }
  });

  return {
    provider: "gp",
    title: result.article.title,
    description: result.article.lead,
    publishedDate: new Date(result.article.publishDate),
    articleId: result.article.uuid,
    articleLink: result.article.url,
    content
  }
}

export async function fromGP() {
  return [await parseGPArticle("dd98878c-beaf-4e3e-a9d8-5ac1d03c8289")];
}