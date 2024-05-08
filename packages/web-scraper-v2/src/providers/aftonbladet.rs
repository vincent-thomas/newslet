use super::Provider;

pub const AFTONBLADET_RSS: &str =
    "https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt";

pub struct Aftonbladet;

impl Provider for Aftonbladet {}
