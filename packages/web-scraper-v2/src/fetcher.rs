use crate::{
    error,
    providers::{aftonbladet, bbc, nyt, svd, svt, wsj, Post, Provider},
};
pub async fn fetch_all_posts() -> Vec<Result<Vec<Post>, error::FetchRSSError>> {
    let r1 = tokio::spawn(aftonbladet::Aftonbladet::fetch_latest_posts(
        aftonbladet::AFTONBLADET_RSS,
    ));
    let r2 = tokio::spawn(aftonbladet::Aftonbladet::fetch_latest_posts(
        aftonbladet::AFTONBLADET_RSS,
    ));
    let r3 = tokio::spawn(svt::Svt::fetch_latest_posts(svt::SVT_RSS));
    let r4 = tokio::spawn(wsj::WallStreetJournal::fetch_latest_posts(wsj::WSJ_RSS));
    let r5 = tokio::spawn(nyt::NytEurope::fetch_latest_posts(nyt::NYT_EUROPE_RSS));
    let r6 = tokio::spawn(bbc::Bbc::fetch_latest_posts(bbc::BBC_RSS));
    let r7 = tokio::spawn(svd::Svd::fetch_latest_posts(svd::SVD_RSS));

    let mut outputs = vec![];

    for thread in Vec::from([r1, r2, r3, r4, r5, r6, r7]) {
        let result = match tokio::join!(thread).0 {
            Ok(value) => value,
            Err(err) => {
                panic!("error joining: {err:?}");
            }
        };
        outputs.push(result);
    }

    return outputs;
}
