FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps
COPY backend/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --only=production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
