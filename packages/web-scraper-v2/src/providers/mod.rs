pub mod aftonbladet;
pub mod dn;
pub mod nyt;
pub mod svt;
pub mod wsj;

use chrono::{DateTime, Utc};
use feed_rs::{model::Feed, parser};
use rayon::prelude::*;
use reqwest::blocking;

use crate::{error, utils};

#[derive(Debug)]
pub struct Post {
  article_id: String,
  // Senare
  // category: Vec<String>,
  title: String,
  description: Option<String>,
  published_date: DateTime<Utc>,
  url: String,
}

pub trait Provider {
  /// Tar emot en RSS url och normaliserar
  fn fetch_latest_posts(url: &str) -> Result<Vec<Post>, error::ParseRSSError> {
    let body = blocking::get(url)
      .unwrap()
      .text()
      .map_err(|_| error::ParseRSSError::FetchRssError {})?;

    let parsed_rss: Feed =
      parser::parse(body.as_bytes()).map_err(|err| error::ParseRSSError::ParseError {})?;

    let parsed_posts = parsed_rss
      .entries
      .par_iter()
      .filter_map(|entry| {
        if entry.title.is_none() || entry.published.is_none() || entry.links.is_empty() {
          return None;
        }

        return Some(Post {
          article_id: entry.id.clone(),
          description: entry
            .summary
            .clone()
            .map(|text| text.content)
            .map(|to_be_formatted| utils::format_str(&to_be_formatted)),
          title: utils::format_str(&entry.title.clone().unwrap().content),
          published_date: entry.published.unwrap(),
          url: entry.clone().links.first().unwrap().clone().href,
        });
      })
      .collect::<Vec<Post>>();

    return Ok(parsed_posts);
  }
  // TODO
  // fn fetch_single_post(_url: &str) {}
}
