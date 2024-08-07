# Stage 1: Build the React application
FROM node:22-alpine as builder

WORKDIR /app

# Install build dependencies
COPY package.json pnpm-lock.yaml ./

# If you're using npm or yarn, adjust the command accordingly
RUN npm install -g pnpm@latest && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Overwrite the default nginx conf
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080
EXPOSE 8080

# When the container starts, start Nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
