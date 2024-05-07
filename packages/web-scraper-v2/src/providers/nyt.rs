use super::Provider;

pub const NYT_EUROPE_RSS: &str = "https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml";

pub struct NytEurope;

impl Provider for NytEurope {}
