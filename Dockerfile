FROM node:23-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Add retry mechanism for npm ci
RUN apk add --no-cache bash && \
    attempt=1 && \
    max_attempts=3 && \
    while [ $attempt -le $max_attempts ]; do \
      echo "Attempt $attempt of $max_attempts: Installing dependencies..." && \
      if npm ci; then \
        echo "Dependencies installed successfully" && \
        break; \
      fi && \
      attempt=$((attempt + 1)) && \
      if [ $attempt -le $max_attempts ]; then \
        echo "Retrying in 5 seconds..." && \
        sleep 5; \
      fi \
    done && \
    if [ $attempt -gt $max_attempts ]; then \
      echo "Failed to install dependencies after $max_attempts attempts" && \
      exit 1; \
    fi

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Security hardening
RUN addgroup -g 101 -S nginx \
    && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx \
    && chown -R nginx:nginx /usr/share/nginx/html

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]