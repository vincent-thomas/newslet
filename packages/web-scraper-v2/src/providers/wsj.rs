use super::Provider;

pub const WSJ_RSS: &str = "https://feeds.a.dj.com/rss/RSSWorldNews.xml";

pub struct WallStreetJournal;

impl Provider for WallStreetJournal {}
