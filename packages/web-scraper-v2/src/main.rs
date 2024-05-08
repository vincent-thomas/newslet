#![warn(
    clippy::all,
    clippy::restriction,
    clippy::pedantic,
    clippy::nursery,
    clippy::cargo
)]
#![allow(clippy::mod_module_files)]
#![allow(clippy::missing_docs_in_private_items)]
#![allow(clippy::unwrap_in_result)]
#![allow(clippy::needless_return)]
#![allow(clippy::implicit_return)]
#![allow(clippy::map_err_ignore)]
#![allow(clippy::question_mark_used)]
#![allow(clippy::unwrap_used)]
#![allow(clippy::single_call_fn)]
#![allow(clippy::missing_trait_methods)]

use providers::Post;

mod error;
mod fetcher;
mod providers;
mod utils;

fn upload_articles(_articles: Vec<Post>) {}

#[tokio::main]
async fn main() {
    let results = fetcher::fetch_all_posts();

    for item in results {
        match item {
            Ok(items) => upload_articles(items),
            Err(err) => {
                panic!("weird error {err:?}");
            }
        };
    }
}
