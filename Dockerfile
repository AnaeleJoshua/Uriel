# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install bash and dependencies
RUN apk add --no-cache bash

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Install sequelize CLI globally (only if really needed at runtime)
RUN npm install --global sequelize-cli

# Expose the port (Render auto-detects from PORT env var, so this is optional)
EXPOSE 5000

# Start the app; ensure app uses process.env.PORT
CMD ["npm", "start"]
