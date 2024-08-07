# Dockerfile to run the frontend
# NOTE: This should only be used for dev purposes. In production, this should be deployed to S3+cloudfront
FROM node:22-alpine as base

WORKDIR /usr/src/app

# Install pnpm
RUN apk add --no-cache git \
    && npm install -g pnpm@latest

# Copying package files and install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base as development
COPY . .

# Serve frontend
EXPOSE 5173
CMD ["pnpm", "run", "dev", "--host"]
