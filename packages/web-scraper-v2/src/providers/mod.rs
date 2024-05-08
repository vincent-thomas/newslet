pub mod aftonbladet;
pub mod bbc;
pub mod nyt;
pub mod svd;
pub mod svt;
pub mod wsj;
use chrono::{DateTime, Utc};
use feed_rs::{model::Feed, parser};
use reqwest::get;

use crate::{error, utils};

#[derive(Debug, Clone)]
pub struct Image {
    source: String,
    width: Option<u32>,
    height: Option<u32>,
}

#[derive(Debug, Clone)]
pub struct Post {
    pub article_id: String,
    pub title: String,
    pub description: Option<String>,
    pub published_date: DateTime<Utc>,
    pub images: Vec<Image>,
    pub thumbnail_images: Vec<Image>,
    pub url: String,
}

// fn extract_og_type_from_html(html: String) -> Option<String> {
//     let selector = Selector::parse("meta[property=\"og:type\"][content=\"article\"]").unwrap();

//     let html = Html::parse_document(&html);

//     if let Some(meta_tag) = html.select(&selector).next() {
//         if let Some(content) = meta_tag.value().attr("content") {
//             return Some(content.to_string());
//         }
//     }
//     None
// }

pub trait Provider {
    /// Tar emot en RSS url och normaliserar
    async fn fetch_latest_posts(url: &str) -> Result<Vec<Post>, error::FetchRSSError> {
        let body = get(url)
            .await
            .map_err(|err| {
                eprintln!("{:?}", err);
                return error::FetchRSSError::FetchRssError {};
            })?
            .text()
            .await
            .map_err(|err| {
                eprintln!("{:?}", err);
                return error::FetchRSSError::FetchRssError {};
            })?;

        let parsed_rss: Feed =
            parser::parse(body.as_bytes()).map_err(|_| error::FetchRSSError::ParseError {})?;

        let mut parsed_posts = vec![];

        for entry in parsed_rss.entries.iter() {
            // title och title.is_empty är för att vissa sidor hänvisar till deras landing page med tom titel i RSS
            if !entry
                .title
                .clone()
                .is_some_and(|title| !title.content.is_empty())
            {
                dbg!("no");
                continue;
            }
            if entry.published.is_none() || entry.links.is_empty() {
                println!("{:#?}", entry);
                continue;
            }

            let article_url = entry.clone().links[0].href.clone();

            let images: Vec<Image> = entry
                .media
                .iter()
                .filter_map(|value| {
                    let image = match value.content.first() {
                        Some(value) => value,
                        None => return None,
                    };

                    return Some(Image {
                        source: image.url.clone()?.to_string(),
                        width: image.width,
                        height: image.height,
                    });
                })
                .collect();

            let thumbnails: Vec<Image> = entry
                .media
                .iter()
                .flat_map(|value| {
                    value
                        .thumbnails
                        .iter()
                        .map(|thumb| Image {
                            source: thumb.image.uri.clone(),
                            height: thumb.image.height,
                            width: thumb.image.width,
                        })
                        .collect::<Vec<Image>>()
                })
                .collect();

            parsed_posts.push(Post {
                article_id: entry.id.clone(),
                thumbnail_images: thumbnails,
                images,
                description: entry
                    .summary
                    .clone()
                    .map(|text| text.content)
                    .map(|to_be_formatted| utils::format_str(&to_be_formatted)),
                title: utils::format_str(&entry.title.clone().unwrap().content),
                published_date: entry.published.unwrap(),
                url: article_url,
            });
        }

        return Ok(parsed_posts);
    }
}
