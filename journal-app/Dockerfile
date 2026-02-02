FROM node:20-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Dev environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Start Next.js dev server
CMD ["npm", "run", "dev"]