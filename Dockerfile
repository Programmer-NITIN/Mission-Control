# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Environment variables must be present at build time for Next.js to inline them
ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCSN5q39Pe7RwkDYYb8ezDRE4nQMWteEC8
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mission-control-bdb12.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=mission-control-bdb12
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mission-control-bdb12.firebasestorage.app
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=69450979027
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:69450979027:web:1896a1d592867f6254a626
ENV NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyB9tj9oWTWTrmsLUnmeD8uoBB7f_wE34m0

RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
