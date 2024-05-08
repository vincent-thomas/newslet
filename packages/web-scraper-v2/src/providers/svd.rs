use super::Provider;

pub const SVD_RSS: &str = "https://www.svd.se/feed/articles.rss";

pub struct Svd;

impl Provider for Svd {}
