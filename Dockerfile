# ============================================
# FRONTEND BUILD STAGE
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm config set fetch-timeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

RUN npm install

COPY frontend/ .

RUN npm run build

# ============================================
# FRONTEND PRODUCTION STAGE
# ============================================
FROM node:20-alpine AS frontend-prod

WORKDIR /app

RUN npm install -g serve

COPY --from=frontend-builder /app/frontend/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]

# ============================================
# STRAPI BUILD STAGE
# ============================================
FROM node:20-alpine AS strapi-builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Configure npm with retries and longer timeout
RUN npm config set fetch-timeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

COPY strapi/package*.json ./

RUN npm install

COPY strapi/ .

# ============================================
# STRAPI PRODUCTION STAGE
# ============================================
FROM node:20-alpine AS strapi-prod

WORKDIR /app

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY --from=strapi-builder /app ./

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 \
  CMD node -e "require('http').get('http://localhost:1337', (r) => {if (r.statusCode >= 200 && r.statusCode < 500) process.exit(0); else process.exit(1)}).on('error', () => process.exit(1))" || exit 1

CMD ["npm", "start"]