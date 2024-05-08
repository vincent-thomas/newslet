FROM rust:1.78 as builder
WORKDIR /app

COPY ./Cargo.toml ./Cargo.lock ./
RUN mkdir packages
RUN cd packages
RUN mkdir web-scraper-v2
RUN cd ..
COPY ./packages/web-scraper-v2/src ./packages/web-scraper-v2/src
COPY ./packages/web-scraper-v2/Cargo.toml ./packages/web-scraper-v2/Cargo.toml

RUN cargo build --release
RUN mv ./target/release/web-scraper-v2 ./app

FROM debian:latest
COPY --from=builder /app/app /usr/local/bin

RUN apt update && apt upgrade -y

RUN apt install openssl -y

ENTRYPOINT ["/usr/local/bin/app"]
