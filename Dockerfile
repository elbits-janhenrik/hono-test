FROM node:20-slim

WORKDIR /app

# Install minimal OS packages required for building native modules and git
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    python3 \
    build-essential \
  && rm -rf /var/lib/apt/lists/*

# Enable corepack to use pnpm if pnpm lock is present
RUN corepack enable

# Copy only package manifests first to leverage Docker layer caching
# Copy the package.json and pnpm lock (project uses pnpm); don't require package-lock.json
COPY package.json pnpm-lock.yaml ./

# Install production dependencies using pnpm when lockfile exists, otherwise npm
ENV CI=true
RUN set -eux; \
    if [ -f pnpm-lock.yaml ]; then \
      echo "Node version:"; node -v; \
      echo "npm version:"; npm -v; \
      echo "Preparing pnpm@8"; corepack prepare pnpm@8 --activate; \
      pnpm -v; \
      echo "Running pnpm install (allowing non-frozen lockfile)..."; \
      pnpm install --prod --no-frozen-lockfile; \
    else \
      npm ci --omit=dev --no-audit --progress=false; \
    fi

# Copy remaining source
COPY . .

EXPOSE 3334

# Run the app with tsx
CMD ["npx", "tsx", "src/index.ts"]
