use std::thread;

use crate::{
  error,
  providers::{aftonbladet, dn, nyt, svt, wsj, Post, Provider},
};
pub fn fetch_all_posts() -> Vec<Result<Vec<Post>, error::ParseRSSError>> {
  let r1 =
    thread::spawn(|| aftonbladet::Aftonbladet::fetch_latest_posts(aftonbladet::AFTONBLADET_RSS));
  let r2 = thread::spawn(|| svt::Svt::fetch_latest_posts(svt::SVT_RSS));
  let r3 = thread::spawn(|| dn::DN::fetch_latest_posts(dn::DN_RSS));
  let r4 = thread::spawn(|| wsj::WallStreetJournal::fetch_latest_posts(wsj::WSJ_RSS));
  let r5 = thread::spawn(|| nyt::NytEurope::fetch_latest_posts(nyt::NYT_EUROPE_RSS));

  let mut outputs = vec![];

  for thread in Vec::from([r1, r2, r3, r4, r5]) {
    let result = match thread.join() {
      Ok(value) => value,
      Err(err) => {
        panic!("error joining: {err:?}");
      }
    };

    outputs.push(result);
  }

  return outputs;
}
