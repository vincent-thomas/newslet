#![warn(clippy::all)]
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
#![allow(clippy::min_ident_chars)]

use providers::Post;
use std::{env, sync::Arc};

mod prelude;

mod error;
mod fetcher;
mod providers;
mod utils;

fn split_into_n<T: Clone>(vec: Vec<T>, n: usize) -> Vec<Vec<T>> {
    let mut results: Vec<Vec<T>> = vec![Vec::new(); n];

    for (i, item) in vec.into_iter().enumerate() {
        results[i % n].push(item);
    }

    results
}

use sqlx::{postgres::PgPoolOptions, Pool, Postgres, QueryBuilder};

async fn upload_articles(pool: Arc<Pool<Postgres>>, articles: Vec<Post>) {
    for chunks in articles.chunks(10) {
        let mut query_builder = QueryBuilder::new(
            "INSERT INTO article (article_id, published_at, title, description, article_url) ",
        );

        query_builder.push_values(chunks, |mut builder, post| {
            builder
                .push_bind(post.article_id.clone())
                .push_bind(post.published_date)
                .push_bind(post.title.clone())
                .push_bind(post.description.clone())
                .push_bind(post.url.clone());
        });

        query_builder.push("ON CONFLICT DO NOTHING");

        let query = query_builder.build();

        let row_results = query.execute(&*pool).await.unwrap();

        println!(
            "uploaded nth of article_ids: {}",
            row_results.rows_affected()
        );
    }
}

#[tokio::main]
async fn main() {
    if cfg!(debug_assertions) {
        dotenvy::from_path(".env").unwrap();
    }

    let database_url = env::var("DATABASE_URL").unwrap();

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .unwrap();

    let shared_pool = Arc::new(pool);

    let results = fetcher::fetch_all_posts().await;

    for item in results {
        match item {
            Ok(items) => {
                let nb_items = 4;
                let parts = split_into_n(items, nb_items);
                let mut threads = vec![];

                for part in parts {
                    let local_pool = Arc::clone(&shared_pool);
                    let green_thread = tokio::spawn(upload_articles(local_pool, part));
                    threads.push(green_thread);
                }

                for handle in threads {
                    let handle_result = handle.await;
                    if handle_result.is_err() {
                        panic!("unknown error when joining: {}", handle_result.unwrap_err());
                    }
                }
            }
            Err(err) => {
                panic!("weird error {err:?}");
            }
        };
    }
}
