# Builder stage
FROM rust:1.97-slim AS builder

WORKDIR /app

# Install build dependencies (OpenSSL is required by reqwest, patch is required by libquickjs-sys)
RUN apt-get update && apt-get install -y pkg-config libssl-dev patch

# Copy project files
COPY . .

# Build release binary
RUN cargo build --release

# Run build step to pre-compile templates and markdown files into /app/dist
RUN ./target/release/portfolio build

FROM debian:bookworm-slim AS runner
WORKDIR /app

# Install ca-certificates AND libssl3 (Required for Debian Bookworm)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Copy your compiled production assets
COPY --from=builder /app/target/release/portfolio /app/portfolio
COPY --from=builder /app/dist /app/dist

EXPOSE 3000
ENV PORT=3000
ENV RUST_LOG=info

CMD ["/app/portfolio", "serve"]
