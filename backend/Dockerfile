FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --include=dev

COPY . .
RUN npx prisma generate
RUN npm run build && echo "Build complete" && ls dist/ && ls dist/src/ | head -5

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/src/main"]
