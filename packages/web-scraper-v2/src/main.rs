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

use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

async fn upload_articles(pool: &Pool<Postgres>, _articles: Vec<Post>) {
    for article in _articles {
        let mut result = sqlx::query!(
            "INSERT INTO \"Article\" (\"articleId\", \"publishedAt\", title, description, provider, \"articleUrl\") VALUES ($1, $2, $3, $4, $5, $6)",
            article.article_id,
            article.published_date.timestamp_millis() as i32,
            article.title,
            article.description,
            "aftonbladet",
            article.url
        )
            .fetch_all(pool).await;
        // dbg!(result);
    }
}

#[tokio::main]
async fn main() {
    dotenvy::from_path(".env").unwrap();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(std::env::var("DATABASE_URL").unwrap().as_str())
        .await
        .unwrap();

    let results = fetcher::fetch_all_posts();

    for item in results {
        match item {
            Ok(items) => upload_articles(&pool, items).await,
            Err(err) => {
                panic!("weird error {err:?}");
            }
        };
    }
}
