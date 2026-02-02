FROM node:20-alpine

WORKDIR /app


COPY package*.json ./


RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3001

# Environment
ENV NODE_ENV=development

# Start backend 
CMD ["npm", "run", "dev"]