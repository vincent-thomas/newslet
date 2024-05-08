pub(crate) enum FetchArticleError {
    NotAnArticle,
}

#[derive(Debug)]
pub enum ParseRSSError {
    ParseError,
    FetchRssError,
}
