use super::Provider;

pub const BBC_RSS: &str = "https://feeds.bbci.co.uk/news/world/europe/rss.xml";

pub struct Bbc;

impl Provider for Bbc {}
